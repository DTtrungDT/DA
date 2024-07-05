/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertGreaterThan, assertGreaterThanOrEqual, assertIndexInRange, assertLessThan } from '../../util/assert';
import { assertTNode, assertTNodeForLView } from '../assert';
import { TYPE } from '../interfaces/container';
import { isLContainer, isLView } from '../interfaces/type_checks';
import { FLAGS, HEADER_OFFSET, HOST, PARENT, PREORDER_HOOK_FLAGS, TRANSPLANTED_VIEWS_TO_REFRESH } from '../interfaces/view';
/**
 * For efficiency reasons we often put several different data types (`RNode`, `LView`, `LContainer`)
 * in same location in `LView`. This is because we don't want to pre-allocate space for it
 * because the storage is sparse. This file contains utilities for dealing with such data types.
 *
 * How do we know what is stored at a given location in `LView`.
 * - `Array.isArray(value) === false` => `RNode` (The normal storage value)
 * - `Array.isArray(value) === true` => then the `value[0]` represents the wrapped value.
 *   - `typeof value[TYPE] === 'object'` => `LView`
 *      - This happens when we have a component at a given location
 *   - `typeof value[TYPE] === true` => `LContainer`
 *      - This happens when we have `LContainer` binding at a given location.
 *
 *
 * NOTE: it is assumed that `Array.isArray` and `typeof` operations are very efficient.
 */
/**
 * Returns `RNode`.
 * @param value wrapped value of `RNode`, `LView`, `LContainer`
 */
export function unwrapRNode(value) {
    while (Array.isArray(value)) {
        value = value[HOST];
    }
    return value;
}
/**
 * Returns `LView` or `null` if not found.
 * @param value wrapped value of `RNode`, `LView`, `LContainer`
 */
export function unwrapLView(value) {
    while (Array.isArray(value)) {
        // This check is same as `isLView()` but we don't call at as we don't want to call
        // `Array.isArray()` twice and give JITer more work for inlining.
        if (typeof value[TYPE] === 'object')
            return value;
        value = value[HOST];
    }
    return null;
}
/**
 * Returns `LContainer` or `null` if not found.
 * @param value wrapped value of `RNode`, `LView`, `LContainer`
 */
export function unwrapLContainer(value) {
    while (Array.isArray(value)) {
        // This check is same as `isLContainer()` but we don't call at as we don't want to call
        // `Array.isArray()` twice and give JITer more work for inlining.
        if (value[TYPE] === true)
            return value;
        value = value[HOST];
    }
    return null;
}
/**
 * Retrieves an element value from the provided `viewData`, by unwrapping
 * from any containers, component views, or style contexts.
 */
export function getNativeByIndex(index, lView) {
    ngDevMode && assertIndexInRange(lView, index);
    ngDevMode && assertGreaterThanOrEqual(index, HEADER_OFFSET, 'Expected to be past HEADER_OFFSET');
    return unwrapRNode(lView[index]);
}
/**
 * Retrieve an `RNode` for a given `TNode` and `LView`.
 *
 * This function guarantees in dev mode to retrieve a non-null `RNode`.
 *
 * @param tNode
 * @param lView
 */
export function getNativeByTNode(tNode, lView) {
    ngDevMode && assertTNodeForLView(tNode, lView);
    ngDevMode && assertIndexInRange(lView, tNode.index);
    const node = unwrapRNode(lView[tNode.index]);
    return node;
}
/**
 * Retrieve an `RNode` or `null` for a given `TNode` and `LView`.
 *
 * Some `TNode`s don't have associated `RNode`s. For example `Projection`
 *
 * @param tNode
 * @param lView
 */
export function getNativeByTNodeOrNull(tNode, lView) {
    const index = tNode === null ? -1 : tNode.index;
    if (index !== -1) {
        ngDevMode && assertTNodeForLView(tNode, lView);
        const node = unwrapRNode(lView[index]);
        return node;
    }
    return null;
}
// fixme(misko): The return Type should be `TNode|null`
export function getTNode(tView, index) {
    ngDevMode && assertGreaterThan(index, -1, 'wrong index for TNode');
    ngDevMode && assertLessThan(index, tView.data.length, 'wrong index for TNode');
    const tNode = tView.data[index];
    ngDevMode && tNode !== null && assertTNode(tNode);
    return tNode;
}
/** Retrieves a value from any `LView` or `TData`. */
export function load(view, index) {
    ngDevMode && assertIndexInRange(view, index);
    return view[index];
}
export function getComponentLViewByIndex(nodeIndex, hostView) {
    // Could be an LView or an LContainer. If LContainer, unwrap to find LView.
    ngDevMode && assertIndexInRange(hostView, nodeIndex);
    const slotValue = hostView[nodeIndex];
    const lView = isLView(slotValue) ? slotValue : slotValue[HOST];
    return lView;
}
/** Checks whether a given view is in creation mode */
export function isCreationMode(view) {
    return (view[FLAGS] & 4 /* LViewFlags.CreationMode */) === 4 /* LViewFlags.CreationMode */;
}
/**
 * Returns a boolean for whether the view is attached to the change detection tree.
 *
 * Note: This determines whether a view should be checked, not whether it's inserted
 * into a container. For that, you'll want `viewAttachedToContainer` below.
 */
export function viewAttachedToChangeDetector(view) {
    return (view[FLAGS] & 64 /* LViewFlags.Attached */) === 64 /* LViewFlags.Attached */;
}
/** Returns a boolean for whether the view is attached to a container. */
export function viewAttachedToContainer(view) {
    return isLContainer(view[PARENT]);
}
export function getConstant(consts, index) {
    if (index === null || index === undefined)
        return null;
    ngDevMode && assertIndexInRange(consts, index);
    return consts[index];
}
/**
 * Resets the pre-order hook flags of the view.
 * @param lView the LView on which the flags are reset
 */
export function resetPreOrderHookFlags(lView) {
    lView[PREORDER_HOOK_FLAGS] = 0;
}
/**
 * Updates the `TRANSPLANTED_VIEWS_TO_REFRESH` counter on the `LContainer` as well as the parents
 * whose
 *  1. counter goes from 0 to 1, indicating that there is a new child that has a view to refresh
 *  or
 *  2. counter goes from 1 to 0, indicating there are no more descendant views to refresh
 */
export function updateTransplantedViewCount(lContainer, amount) {
    lContainer[TRANSPLANTED_VIEWS_TO_REFRESH] += amount;
    let viewOrContainer = lContainer;
    let parent = lContainer[PARENT];
    while (parent !== null &&
        ((amount === 1 && viewOrContainer[TRANSPLANTED_VIEWS_TO_REFRESH] === 1) ||
            (amount === -1 && viewOrContainer[TRANSPLANTED_VIEWS_TO_REFRESH] === 0))) {
        parent[TRANSPLANTED_VIEWS_TO_REFRESH] += amount;
        viewOrContainer = parent;
        parent = parent[PARENT];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld191dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvdXRpbC92aWV3X3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBRSx3QkFBd0IsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNsSCxPQUFPLEVBQUMsV0FBVyxFQUFFLG1CQUFtQixFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQzNELE9BQU8sRUFBYSxJQUFJLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUd6RCxPQUFPLEVBQUMsWUFBWSxFQUFFLE9BQU8sRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBcUIsTUFBTSxFQUFFLG1CQUFtQixFQUFTLDZCQUE2QixFQUFRLE1BQU0sb0JBQW9CLENBQUM7QUFJM0o7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUg7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FBQyxLQUE2QjtJQUN2RCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDM0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQVEsQ0FBQztLQUM1QjtJQUNELE9BQU8sS0FBYyxDQUFDO0FBQ3hCLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsV0FBVyxDQUFDLEtBQTZCO0lBQ3ZELE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMzQixrRkFBa0Y7UUFDbEYsaUVBQWlFO1FBQ2pFLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUTtZQUFFLE9BQU8sS0FBYyxDQUFDO1FBQzNELEtBQUssR0FBRyxLQUFLLENBQUMsSUFB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LElBQUksTUFBTSxDQUFDO0lBQ3BELElBQUksZUFBZSxHQUFxQixVQUFVLENBQUM7SUFDbkQsSUFBSSxNQUFNLEdBQTBCLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RCxPQUFPLE1BQU0sS0FBSyxJQUFJO1FBQ2YsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksZUFBZSxDQUFDLDZCQUE2QixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RFLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxJQUFJLGVBQWUsQ0FBQyw2QkFBNkIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDaEYsTUFBTSxDQUFDLDZCQUE2QixDQUFDLElBQUksTUFBTSxDQUFDO1FBQ2hELGVBQWUsR0FBRyxNQUFNLENBQUM7UUFDekIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN6QjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHthc3NlcnRHcmVhdGVyVGhhbiwgYXNzZXJ0R3JlYXRlclRoYW5PckVxdWFsLCBhc3NlcnRJbmRleEluUmFuZ2UsIGFzc2VydExlc3NUaGFufSBmcm9tICcuLi8uLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQge2Fzc2VydFROb2RlLCBhc3NlcnRUTm9kZUZvckxWaWV3fSBmcm9tICcuLi9hc3NlcnQnO1xuaW1wb3J0IHtMQ29udGFpbmVyLCBUWVBFfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NvbnRhaW5lcic7XG5pbXBvcnQge1RDb25zdGFudHMsIFROb2RlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUnO1xuaW1wb3J0IHtSTm9kZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9yZW5kZXJlcl9kb20nO1xuaW1wb3J0IHtpc0xDb250YWluZXIsIGlzTFZpZXd9IGZyb20gJy4uL2ludGVyZmFjZXMvdHlwZV9jaGVja3MnO1xuaW1wb3J0IHtGTEFHUywgSEVBREVSX09GRlNFVCwgSE9TVCwgTFZpZXcsIExWaWV3RmxhZ3MsIFBBUkVOVCwgUFJFT1JERVJfSE9PS19GTEFHUywgVERhdGEsIFRSQU5TUExBTlRFRF9WSUVXU19UT19SRUZSRVNILCBUVmlld30gZnJvbSAnLi4vaW50ZXJmYWNlcy92aWV3JztcblxuXG5cbi8qKlxuICogRm9yIGVmZmljaWVuY3kgcmVhc29ucyB3ZSBvZnRlbiBwdXQgc2V2ZXJhbCBkaWZmZXJlbnQgZGF0YSB0eXBlcyAoYFJOb2RlYCwgYExWaWV3YCwgYExDb250YWluZXJgKVxuICogaW4gc2FtZSBsb2NhdGlvbiBpbiBgTFZpZXdgLiBUaGlzIGlzIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBwcmUtYWxsb2NhdGUgc3BhY2UgZm9yIGl0XG4gKiBiZWNhdXNlIHRoZSBzdG9yYWdlIGlzIHNwYXJzZS4gVGhpcyBmaWxlIGNvbnRhaW5zIHV0aWxpdGllcyBmb3IgZGVhbGluZyB3aXRoIHN1Y2ggZGF0YSB0eXBlcy5cbiAqXG4gKiBIb3cgZG8gd2Uga25vdyB3aGF0IGlzIHN0b3JlZCBhdCBhIGdpdmVuIGxvY2F0aW9uIGluIGBMVmlld2AuXG4gKiAtIGBBcnJheS5pc0FycmF5KHZhbHVlKSA9PT0gZmFsc2VgID0+IGBSTm9kZWAgKFRoZSBub3JtYWwgc3RvcmFnZSB2YWx1ZSlcbiAqIC0gYEFycmF5LmlzQXJyYXkodmFsdWUpID09PSB0cnVlYCA9PiB0aGVuIHRoZSBgdmFsdWVbMF1gIHJlcHJlc2VudHMgdGhlIHdyYXBwZWQgdmFsdWUuXG4gKiAgIC0gYHR5cGVvZiB2YWx1ZVtUWVBFXSA9PT0gJ29iamVjdCdgID0+IGBMVmlld2BcbiAqICAgICAgLSBUaGlzIGhhcHBlbnMgd2hlbiB3ZSBoYXZlIGEgY29tcG9uZW50IGF0IGEgZ2l2ZW4gbG9jYXRpb25cbiAqICAgLSBgdHlwZW9mIHZhbHVlW1RZUEVdID09PSB0cnVlYCA9PiBgTENvbnRhaW5lcmBcbiAqICAgICAgLSBUaGlzIGhhcHBlbnMgd2hlbiB3ZSBoYXZlIGBMQ29udGFpbmVyYCBiaW5kaW5nIGF0IGEgZ2l2ZW4gbG9jYXRpb24uXG4gKlxuICpcbiAqIE5PVEU6IGl0IGlzIGFzc3VtZWQgdGhhdCBgQXJyYXkuaXNBcnJheWAgYW5kIGB0eXBlb2ZgIG9wZXJhdGlvbnMgYXJlIHZlcnkgZWZmaWNpZW50LlxuICovXG5cbi8qKlxuICogUmV0dXJucyBgUk5vZGVgLlxuICogQHBhcmFtIHZhbHVlIHdyYXBwZWQgdmFsdWUgb2YgYFJOb2RlYCwgYExWaWV3YCwgYExDb250YWluZXJgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBSTm9kZSh2YWx1ZTogUk5vZGV8TFZpZXd8TENvbnRhaW5lcik6IFJOb2RlIHtcbiAgd2hpbGUgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdmFsdWUgPSB2YWx1ZVtIT1NUXSBhcyBhbnk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlIGFzIFJOb2RlO1xufVxuXG4vKipcbiAqIFJldHVybnMgYExWaWV3YCBvciBgbnVsbGAgaWYgbm90IGZvdW5kLlxuICogQHBhcmFtIHZhbHVlIHdyYXBwZWQgdmFsdWUgb2YgYFJOb2RlYCwgYExWaWV3YCwgYExDb250YWluZXJgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBMVmlldyh2YWx1ZTogUk5vZGV8TFZpZXd8TENvbnRhaW5lcik6IExWaWV3fG51bGwge1xuICB3aGlsZSAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAvLyBUaGlzIGNoZWNrIGlzIHNhbWUgYXMgYGlzTFZpZXcoKWAgYnV0IHdlIGRvbid0IGNhbGwgYXQgYXMgd2UgZG9uJ3Qgd2FudCB0byBjYWxsXG4gICAgLy8gYEFycmF5LmlzQXJyYXkoKWAgdHdpY2UgYW5kIGdpdmUgSklUZXIgbW9yZSB3b3JrIGZvciBpbmxpbmluZy5cbiAgICBpZiAodHlwZW9mIHZhbHVlW1RZUEVdID09PSAnb2JqZWN0JykgcmV0dXJuIHZhbHVlIGFzIExWaWV3O1xuICAgIHZhbHVlID0gdmFsdWVbSE9TVF0gYXMgYW55O1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFJldHVybnMgYExDb250YWluZXJgIG9yIGBudWxsYCBpZiBub3QgZm91bmQuXG4gKiBAcGFyYW0gdmFsdWUgd3JhcHBlZCB2YWx1ZSBvZiBgUk5vZGVgLCBgTFZpZXdgLCBgTENvbnRhaW5lcmBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcExDb250YWluZXIodmFsdWU6IFJOb2RlfExWaWV3fExDb250YWluZXIpOiBMQ29udGFpbmVyfG51bGwge1xuICB3aGlsZSAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAvLyBUaGlzIGNoZWNrIGlzIHNhbWUgYXMgYGlzTENvbnRhaW5lcigpYCBidXQgd2UgZG9uJ3QgY2FsbCBhdCBhcyB3ZSBkb24ndCB3YW50IHRvIGNhbGxcbiAgICAvLyBgQXJyYXkuaXNBcnJheSgpYCB0d2ljZSBhbmQgZ2l2ZSBKSVRlciBtb3JlIHdvcmsgZm9yIGlubGluaW5nLlxuICAgIGlmICh2YWx1ZVtUWVBFXSA9PT0gdHJ1ZSkgcmV0dXJuIHZhbHVlIGFzIExDb250YWluZXI7XG4gICAgdmFsdWUgPSB2YWx1ZVtIT1NUXSBhcyBhbnk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGFuIGVsZW1lbnQgdmFsdWUgZnJvbSB0aGUgcHJvdmlkZWQgYHZpZXdEYXRhYCwgYnkgdW53cmFwcGluZ1xuICogZnJvbSBhbnkgY29udGFpbmVycywgY29tcG9uZW50IHZpZXdzLCBvciBzdHlsZSBjb250ZXh0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5hdGl2ZUJ5SW5kZXgoaW5kZXg6IG51bWJlciwgbFZpZXc6IExWaWV3KTogUk5vZGUge1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0SW5kZXhJblJhbmdlKGxWaWV3LCBpbmRleCk7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRHcmVhdGVyVGhhbk9yRXF1YWwoaW5kZXgsIEhFQURFUl9PRkZTRVQsICdFeHBlY3RlZCB0byBiZSBwYXN0IEhFQURFUl9PRkZTRVQnKTtcbiAgcmV0dXJuIHVud3JhcFJOb2RlKGxWaWV3W2luZGV4XSk7XG59XG5cbi8qKlxuICogUmV0cmlldmUgYW4gYFJOb2RlYCBmb3IgYSBnaXZlbiBgVE5vZGVgIGFuZCBgTFZpZXdgLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gZ3VhcmFudGVlcyBpbiBkZXYgbW9kZSB0byByZXRyaWV2ZSBhIG5vbi1udWxsIGBSTm9kZWAuXG4gKlxuICogQHBhcmFtIHROb2RlXG4gKiBAcGFyYW0gbFZpZXdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5hdGl2ZUJ5VE5vZGUodE5vZGU6IFROb2RlLCBsVmlldzogTFZpZXcpOiBSTm9kZSB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRUTm9kZUZvckxWaWV3KHROb2RlLCBsVmlldyk7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRJbmRleEluUmFuZ2UobFZpZXcsIHROb2RlLmluZGV4KTtcbiAgY29uc3Qgbm9kZTogUk5vZGUgPSB1bndyYXBSTm9kZShsVmlld1t0Tm9kZS5pbmRleF0pO1xuICByZXR1cm4gbm9kZTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBhbiBgUk5vZGVgIG9yIGBudWxsYCBmb3IgYSBnaXZlbiBgVE5vZGVgIGFuZCBgTFZpZXdgLlxuICpcbiAqIFNvbWUgYFROb2RlYHMgZG9uJ3QgaGF2ZSBhc3NvY2lhdGVkIGBSTm9kZWBzLiBGb3IgZXhhbXBsZSBgUHJvamVjdGlvbmBcbiAqXG4gKiBAcGFyYW0gdE5vZGVcbiAqIEBwYXJhbSBsVmlld1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmF0aXZlQnlUTm9kZU9yTnVsbCh0Tm9kZTogVE5vZGV8bnVsbCwgbFZpZXc6IExWaWV3KTogUk5vZGV8bnVsbCB7XG4gIGNvbnN0IGluZGV4ID0gdE5vZGUgPT09IG51bGwgPyAtMSA6IHROb2RlLmluZGV4O1xuICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydFROb2RlRm9yTFZpZXcodE5vZGUhLCBsVmlldyk7XG4gICAgY29uc3Qgbm9kZTogUk5vZGV8bnVsbCA9IHVud3JhcFJOb2RlKGxWaWV3W2luZGV4XSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cblxuLy8gZml4bWUobWlza28pOiBUaGUgcmV0dXJuIFR5cGUgc2hvdWxkIGJlIGBUTm9kZXxudWxsYFxuZXhwb3J0IGZ1bmN0aW9uIGdldFROb2RlKHRWaWV3OiBUVmlldywgaW5kZXg6IG51bWJlcik6IFROb2RlIHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydEdyZWF0ZXJUaGFuKGluZGV4LCAtMSwgJ3dyb25nIGluZGV4IGZvciBUTm9kZScpO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0TGVzc1RoYW4oaW5kZXgsIHRWaWV3LmRhdGEubGVuZ3RoLCAnd3JvbmcgaW5kZXggZm9yIFROb2RlJyk7XG4gIGNvbnN0IHROb2RlID0gdFZpZXcuZGF0YVtpbmRleF0gYXMgVE5vZGU7XG4gIG5nRGV2TW9kZSAmJiB0Tm9kZSAhPT0gbnVsbCAmJiBhc3NlcnRUTm9kZSh0Tm9kZSk7XG4gIHJldHVybiB0Tm9kZTtcbn1cblxuLyoqIFJldHJpZXZlcyBhIHZhbHVlIGZyb20gYW55IGBMVmlld2Agb3IgYFREYXRhYC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkPFQ+KHZpZXc6IExWaWV3fFREYXRhLCBpbmRleDogbnVtYmVyKTogVCB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRJbmRleEluUmFuZ2UodmlldywgaW5kZXgpO1xuICByZXR1cm4gdmlld1tpbmRleF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wb25lbnRMVmlld0J5SW5kZXgobm9kZUluZGV4OiBudW1iZXIsIGhvc3RWaWV3OiBMVmlldyk6IExWaWV3IHtcbiAgLy8gQ291bGQgYmUgYW4gTFZpZXcgb3IgYW4gTENvbnRhaW5lci4gSWYgTENvbnRhaW5lciwgdW53cmFwIHRvIGZpbmQgTFZpZXcuXG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRJbmRleEluUmFuZ2UoaG9zdFZpZXcsIG5vZGVJbmRleCk7XG4gIGNvbnN0IHNsb3RWYWx1ZSA9IGhvc3RWaWV3W25vZGVJbmRleF07XG4gIGNvbnN0IGxWaWV3ID0gaXNMVmlldyhzbG90VmFsdWUpID8gc2xvdFZhbHVlIDogc2xvdFZhbHVlW0hPU1RdO1xuICByZXR1cm4gbFZpZXc7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciBhIGdpdmVuIHZpZXcgaXMgaW4gY3JlYXRpb24gbW9kZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ3JlYXRpb25Nb2RlKHZpZXc6IExWaWV3KTogYm9vbGVhbiB7XG4gIHJldHVybiAodmlld1tGTEFHU10gJiBMVmlld0ZsYWdzLkNyZWF0aW9uTW9kZSkgPT09IExWaWV3RmxhZ3MuQ3JlYXRpb25Nb2RlO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBib29sZWFuIGZvciB3aGV0aGVyIHRoZSB2aWV3IGlzIGF0dGFjaGVkIHRvIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIHRyZWUuXG4gKlxuICogTm90ZTogVGhpcyBkZXRlcm1pbmVzIHdoZXRoZXIgYSB2aWV3IHNob3VsZCBiZSBjaGVja2VkLCBub3Qgd2hldGhlciBpdCdzIGluc2VydGVkXG4gKiBpbnRvIGEgY29udGFpbmVyLiBGb3IgdGhhdCwgeW91J2xsIHdhbnQgYHZpZXdBdHRhY2hlZFRvQ29udGFpbmVyYCBiZWxvdy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZpZXdBdHRhY2hlZFRvQ2hhbmdlRGV0ZWN0b3IodmlldzogTFZpZXcpOiBib29sZWFuIHtcbiAgcmV0dXJuICh2aWV3W0ZMQUdTXSAmIExWaWV3RmxhZ3MuQXR0YWNoZWQpID09PSBMVmlld0ZsYWdzLkF0dGFjaGVkO1xufVxuXG4vKiogUmV0dXJucyBhIGJvb2xlYW4gZm9yIHdoZXRoZXIgdGhlIHZpZXcgaXMgYXR0YWNoZWQgdG8gYSBjb250YWluZXIuICovXG5leHBvcnQgZnVuY3Rpb24gdmlld0F0dGFjaGVkVG9Db250YWluZXIodmlldzogTFZpZXcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzTENvbnRhaW5lcih2aWV3W1BBUkVOVF0pO1xufVxuXG4vKiogUmV0dXJucyBhIGNvbnN0YW50IGZyb20gYFRDb25zdGFudHNgIGluc3RhbmNlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnN0YW50PFQ+KGNvbnN0czogVENvbnN0YW50c3xudWxsLCBpbmRleDogbnVsbHx1bmRlZmluZWQpOiBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnN0YW50PFQ+KGNvbnN0czogVENvbnN0YW50cywgaW5kZXg6IG51bWJlcik6IFR8bnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25zdGFudDxUPihjb25zdHM6IFRDb25zdGFudHN8bnVsbCwgaW5kZXg6IG51bWJlcnxudWxsfHVuZGVmaW5lZCk6IFR8bnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25zdGFudDxUPihjb25zdHM6IFRDb25zdGFudHN8bnVsbCwgaW5kZXg6IG51bWJlcnxudWxsfHVuZGVmaW5lZCk6IFR8bnVsbCB7XG4gIGlmIChpbmRleCA9PT0gbnVsbCB8fCBpbmRleCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbmdEZXZNb2RlICYmIGFzc2VydEluZGV4SW5SYW5nZShjb25zdHMhLCBpbmRleCk7XG4gIHJldHVybiBjb25zdHMhW2luZGV4XSBhcyB1bmtub3duIGFzIFQ7XG59XG5cbi8qKlxuICogUmVzZXRzIHRoZSBwcmUtb3JkZXIgaG9vayBmbGFncyBvZiB0aGUgdmlldy5cbiAqIEBwYXJhbSBsVmlldyB0aGUgTFZpZXcgb24gd2hpY2ggdGhlIGZsYWdzIGFyZSByZXNldFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRQcmVPcmRlckhvb2tGbGFncyhsVmlldzogTFZpZXcpIHtcbiAgbFZpZXdbUFJFT1JERVJfSE9PS19GTEFHU10gPSAwO1xufVxuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIGBUUkFOU1BMQU5URURfVklFV1NfVE9fUkVGUkVTSGAgY291bnRlciBvbiB0aGUgYExDb250YWluZXJgIGFzIHdlbGwgYXMgdGhlIHBhcmVudHNcbiAqIHdob3NlXG4gKiAgMS4gY291bnRlciBnb2VzIGZyb20gMCB0byAxLCBpbmRpY2F0aW5nIHRoYXQgdGhlcmUgaXMgYSBuZXcgY2hpbGQgdGhhdCBoYXMgYSB2aWV3IHRvIHJlZnJlc2hcbiAqICBvclxuICogIDIuIGNvdW50ZXIgZ29lcyBmcm9tIDEgdG8gMCwgaW5kaWNhdGluZyB0aGVyZSBhcmUgbm8gbW9yZSBkZXNjZW5kYW50IHZpZXdzIHRvIHJlZnJlc2hcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRyYW5zcGxhbnRlZFZpZXdDb3VudChsQ29udGFpbmVyOiBMQ29udGFpbmVyLCBhbW91bnQ6IDF8LSAxKSB7XG4gIGxDb250YWluZXJbVFJBTlNQTEFOVEVEX1ZJRVdTX1RPX1JFRlJFU0hdICs9IGFtb3VudDtcbiAgbGV0IHZpZXdPckNvbnRhaW5lcjogTFZpZXd8TENvbnRhaW5lciA9IGxDb250YWluZXI7XG4gIGxldCBwYXJlbnQ6IExWaWV3fExDb250YWluZXJ8bnVsbCA9IGxDb250YWluZXJbUEFSRU5UXTtcbiAgd2hpbGUgKHBhcmVudCAhPT0gbnVsbCAmJlxuICAgICAgICAgKChhbW91bnQgPT09IDEgJiYgdmlld09yQ29udGFpbmVyW1RSQU5TUExBTlRFRF9WSUVXU19UT19SRUZSRVNIXSA9PT0gMSkgfHxcbiAgICAgICAgICAoYW1vdW50ID09PSAtMSAmJiB2aWV3T3JDb250YWluZXJbVFJBTlNQTEFOVEVEX1ZJRVdTX1RPX1JFRlJFU0hdID09PSAwKSkpIHtcbiAgICBwYXJlbnRbVFJBTlNQTEFOVEVEX1ZJRVdTX1RPX1JFRlJFU0hdICs9IGFtb3VudDtcbiAgICB2aWV3T3JDb250YWluZXIgPSBwYXJlbnQ7XG4gICAgcGFyZW50ID0gcGFyZW50W1BBUkVOVF07XG4gIH1cbn1cbiJdfQ==