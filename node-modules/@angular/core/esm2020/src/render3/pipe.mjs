/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { setInjectImplementation } from '../di/inject_switch';
import { RuntimeError } from '../errors';
import { getFactoryDef } from './definition_factory';
import { setIncludeViewProviders } from './di';
import { store, ɵɵdirectiveInject } from './instructions/all';
import { isHostComponentStandalone } from './instructions/element_validation';
import { CONTEXT, DECLARATION_COMPONENT_VIEW, HEADER_OFFSET, TVIEW } from './interfaces/view';
import { pureFunction1Internal, pureFunction2Internal, pureFunction3Internal, pureFunction4Internal, pureFunctionVInternal } from './pure_function';
import { getBindingRoot, getLView, getTView } from './state';
import { load } from './util/view_utils';
/**
 * Create a pipe.
 *
 * @param index Pipe index where the pipe will be stored.
 * @param pipeName The name of the pipe
 * @returns T the instance of the pipe.
 *
 * @codeGenApi
 */
export function ɵɵpipe(index, pipeName) {
    const tView = getTView();
    let pipeDef;
    const adjustedIndex = index + HEADER_OFFSET;
    if (tView.firstCreatePass) {
        // The `getPipeDef` throws if a pipe with a given name is not found
        // (so we use non-null assertion below).
        pipeDef = getPipeDef(pipeName, tView.pipeRegistry);
        tView.data[adjustedIndex] = pipeDef;
        if (pipeDef.onDestroy) {
            (tView.destroyHooks || (tView.destroyHooks = [])).push(adjustedIndex, pipeDef.onDestroy);
        }
    }
    else {
        pipeDef = tView.data[adjustedIndex];
    }
    const pipeFactory = pipeDef.factory || (pipeDef.factory = getFactoryDef(pipeDef.type, true));
    const previousInjectImplementation = setInjectImplementation(ɵɵdirectiveInject);
    try {
        // DI for pipes is supposed to behave like directives when placed on a component
        // host node, which means that we have to disable access to `viewProviders`.
        const previousIncludeViewProviders = setIncludeViewProviders(false);
        const pipeInstance = pipeFactory();
        setIncludeViewProviders(previousIncludeViewProviders);
        store(tView, getLView(), adjustedIndex, pipeInstance);
        return pipeInstance;
    }
    finally {
        // we have to restore the injector implementation in finally, just in case the creation of the
        // pipe throws an error.
        setInjectImplementation(previousInjectImplementation);
    }
}
/**
 * Searches the pipe registry for a pipe with the given name. If one is found,
 * returns the pipe. Otherwise, an error is thrown because the pipe cannot be resolved.
 *
 * @param name Name of pipe to resolve
 * @param registry Full list of available pipes
 * @returns Matching PipeDef
 */
function getPipeDef(name, registry) {
    if (registry) {
        for (let i = registry.length - 1; i >= 0; i--) {
            const pipeDef = registry[i];
            if (name === pipeDef.name) {
                return pipeDef;
            }
        }
    }
    if (ngDevMode) {
        throw new RuntimeError(-302 /* RuntimeErrorCode.PIPE_NOT_FOUND */, getPipeNotFoundErrorMessage(name));
    }
}
/**
 * Generates a helpful error message for the user when a pipe is not found.
 *
 * @param name Name of the missing pipe
 * @returns The error message
 */
function getPipeNotFoundErrorMessage(name) {
    const lView = getLView();
    const declarationLView = lView[DECLARATION_COMPONENT_VIEW];
    const context = declarationLView[CONTEXT];
    const hostIsStandalone = isHostComponentStandalone(lView);
    const componentInfoMessage = context ? ` in the '${context.constructor.name}' component` : '';
    const verifyMessage = `Verify that it is ${hostIsStandalone ? 'included in the \'@Component.imports\' of this component' :
        'declared or imported in this module'}`;
    const errorMessage = `The pipe '${name}' could not be found${componentInfoMessage}. ${verifyMessage}`;
    return errorMessage;
}
/**
 * Invokes a pipe with 1 arguments.
 *
 * This instruction acts as a guard to {@link PipeTransform#transform} invoking
 * the pipe only when an input to the pipe changes.
 *
 * @param index Pipe index where the pipe was stored on creation.
 * @param slotOffset the offset in the reserved slot space
 * @param v1 1st argument to {@link PipeTransform#transform}.
 *
 * @codeGenApi
 */
export function ɵɵpipeBind1(index, slotOffset, v1) {
    const adjustedIndex = index + HEADER_OFFSET;
    const lView = getLView();
    const pipeInstance = load(lView, adjustedIndex);
    return isPure(lView, adjustedIndex) ?
        pureFunction1Internal(lView, getBindingRoot(), slotOffset, pipeInstance.transform, v1, pipeInstance) :
        pipeInstance.transform(v1);
}
/**
 * Invokes a pipe with 2 arguments.
 *
 * This instruction acts as a guard to {@link PipeTransform#transform} invoking
 * the pipe only when an input to the pipe changes.
 *
 * @param index Pipe index where the pipe was stored on creation.
 * @param slotOffset the offset in the reserved slot space
 * @param v1 1st argument to {@link PipeTransform#transform}.
 * @param v2 2nd argument to {@link PipeTransform#transform}.
 *
 * @codeGenApi
 */
export function ɵɵpipeBind2(index, slotOffset, v1, v2) {
    const adjustedIndex = index + HEADER_OFFSET;
    const lView = getLView();
    const pipeInstance = load(lView, adjustedIndex);
    return isPure(lView, adjustedIndex) ?
        pureFunction2Internal(lView, getBindingRoot(), slotOffset, pipeInstance.transform, v1, v2, pipeInstance) :
        pipeInstance.transform(v1, v2);
}
/**
 * Invokes a pipe with 3 arguments.
 *
 * This instruction acts as a guard to {@link PipeTransform#transform} invoking
 * the pipe only when an input to the pipe changes.
 *
 * @param index Pipe index where the pipe was stored on creation.
 * @param slotOffset the offset in the reserved slot space
 * @param v1 1st argument to {@link PipeTransform#transform}.
 * @param v2 2nd argument to {@link PipeTransform#transform}.
 * @param v3 4rd argument to {@link PipeTransform#transform}.
 *
 * @codeGenApi
 */
export function ɵɵpipeBind3(index, slotOffset, v1, v2, v3) {
    const adjustedIndex = index + HEADER_OFFSET;
    const lView = getLView();
    const pipeInstance = load(lView, adjustedIndex);
    return isPure(lView, adjustedIndex) ?
        pureFunction3Internal(lView, getBindingRoot(), slotOffset, pipeInstance.transform, v1, v2, v3, pipeInstance) :
        pipeInstance.transform(v1, v2, v3);
}
/**
 * Invokes a pipe with 4 arguments.
 *
 * This instruction acts as a guard to {@link PipeTransform#transform} invoking
 * the pipe only when an input to the pipe changes.
 *
 * @param index Pipe index where the pipe was stored on creation.
 * @param slotOffset the offset in the reserved slot space
 * @param v1 1st argument to {@link PipeTransform#transform}.
 * @param v2 2nd argument to {@link PipeTransform#transform}.
 * @param v3 3rd argument to {@link PipeTransform#transform}.
 * @param v4 4th argument to {@link PipeTransform#transform}.
 *
 * @codeGenApi
 */
export function ɵɵpipeBind4(index, slotOffset, v1, v2, v3, v4) {
    const adjustedIndex = index + HEADER_OFFSET;
    const lView = getLView();
    const pipeInstance = load(lView, adjustedIndex);
    return isPure(lView, adjustedIndex) ? pureFunction4Internal(lView, getBindingRoot(), slotOffset, pipeInstance.transform, v1, v2, v3, v4, pipeInstance) :
        pipeInstance.transform(v1, v2, v3, v4);
}
/**
 * Invokes a pipe with variable number of arguments.
 *
 * This instruction acts as a guard to {@link PipeTransform#transform} invoking
 * the pipe only when an input to the pipe changes.
 *
 * @param index Pipe index where the pipe was stored on creation.
 * @param slotOffset the offset in the reserved slot space
 * @param values Array of arguments to pass to {@link PipeTransform#transform} method.
 *
 * @codeGenApi
 */
export function ɵɵpipeBindV(index, slotOffset, values) {
    const adjustedIndex = index + HEADER_OFFSET;
    const lView = getLView();
    const pipeInstance = load(lView, adjustedIndex);
    return isPure(lView, adjustedIndex) ?
        pureFunctionVInternal(lView, getBindingRoot(), slotOffset, pipeInstance.transform, values, pipeInstance) :
        pipeInstance.transform.apply(pipeInstance, values);
}
function isPure(lView, index) {
    return lView[TVIEW].data[index].pure;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsWUFBWSxFQUFtQixNQUFNLFdBQVcsQ0FBQztBQUd6RCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM1RCxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUU1RSxPQUFPLEVBQUMsT0FBTyxFQUFFLDBCQUEwQixFQUFFLGFBQWEsRUFBUyxLQUFLLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRyxPQUFPLEVBQUMscUJBQXFCLEVBQUUscUJBQXFCLEVBQUUscUJBQXFCLEVBQUUscUJBQXFCLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsSixPQUFPLEVBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDM0QsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBSXZDOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLE1BQU0sQ0FBQyxLQUFhLEVBQUUsUUFBZ0I7SUFDcEQsTUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUM7SUFDekIsSUFBSSxPQUFxQixDQUFDO0lBQzFCLE1BQU0sYUFBYSxHQUFHLEtBQUssR0FBRyxhQUFhLENBQUM7SUFFNUMsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFO1FBQ3pCLG1FQUFtRTtR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O0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FBQyxLQUFhLEVBQUUsVUFBa0IsRUFBRSxNQUF1QjtJQUNwRixNQUFNLGFBQWEsR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDO0lBQzVDLE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBZ0IsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQy9ELE9BQU8sTUFBTSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLHFCQUFxQixDQUNqQixLQUFLLEVBQUUsY0FBYyxFQUFFLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDeEYsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxLQUFZLEVBQUUsS0FBYTtJQUN6QyxPQUFzQixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDLElBQUksQ0FBQztBQUN2RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UGlwZVRyYW5zZm9ybX0gZnJvbSAnLi4vY2hhbmdlX2RldGVjdGlvbi9waXBlX3RyYW5zZm9ybSc7XG5pbXBvcnQge3NldEluamVjdEltcGxlbWVudGF0aW9ufSBmcm9tICcuLi9kaS9pbmplY3Rfc3dpdGNoJztcbmltcG9ydCB7UnVudGltZUVycm9yLCBSdW50aW1lRXJyb3JDb2RlfSBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi9pbnRlcmZhY2UvdHlwZSc7XG5cbmltcG9ydCB7Z2V0RmFjdG9yeURlZn0gZnJvbSAnLi9kZWZpbml0aW9uX2ZhY3RvcnknO1xuaW1wb3J0IHtzZXRJbmNsdWRlVmlld1Byb3ZpZGVyc30gZnJvbSAnLi9kaSc7XG5pbXBvcnQge3N0b3JlLCDJtcm1ZGlyZWN0aXZlSW5qZWN0fSBmcm9tICcuL2luc3RydWN0aW9ucy9hbGwnO1xuaW1wb3J0IHtpc0hvc3RDb21wb25lbnRTdGFuZGFsb25lfSBmcm9tICcuL2luc3RydWN0aW9ucy9lbGVtZW50X3ZhbGlkYXRpb24nO1xuaW1wb3J0IHtQaXBlRGVmLCBQaXBlRGVmTGlzdH0gZnJvbSAnLi9pbnRlcmZhY2VzL2RlZmluaXRpb24nO1xuaW1wb3J0IHtDT05URVhULCBERUNMQVJBVElPTl9DT01QT05FTlRfVklFVywgSEVBREVSX09GRlNFVCwgTFZpZXcsIFRWSUVXfSBmcm9tICcuL2ludGVyZmFjZXMvdmlldyc7XG5pbXBvcnQge3B1cmVGdW5jdGlvbjFJbnRlcm5hbCwgcHVyZUZ1bmN0aW9uMkludGVybmFsLCBwdXJlRnVuY3Rpb24zSW50ZXJuYWwsIHB1cmVGdW5jdGlvbjRJbnRlcm5hbCwgcHVyZUZ1bmN0aW9uVkludGVybmFsfSBmcm9tICcuL3B1cmVfZnVuY3Rpb24nO1xuaW1wb3J0IHtnZXRCaW5kaW5nUm9vdCwgZ2V0TFZpZXcsIGdldFRWaWV3fSBmcm9tICcuL3N0YXRlJztcbmltcG9ydCB7bG9hZH0gZnJvbSAnLi91dGlsL3ZpZXdfdXRpbHMnO1xuXG5cblxuLyoqXG4gKiBDcmVhdGUgYSBwaXBlLlxuICpcbiAqIEBwYXJhbSBpbmRleCBQaXBlIGluZGV4IHdoZXJlIHRoZSBwaXBlIHdpbGwgYmUgc3RvcmVkLlxuICogQHBhcmFtIHBpcGVOYW1lIFRoZSBuYW1lIG9mIHRoZSBwaXBlXG4gKiBAcmV0dXJucyBUIHRoZSBpbnN0YW5jZSBvZiB0aGUgcGlwZS5cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtXBpcGUoaW5kZXg6IG51bWJlciwgcGlwZU5hbWU6IHN0cmluZyk6IGFueSB7XG4gIGNvbnN0IHRWaWV3ID0gZ2V0VFZpZXcoKTtcbiAgbGV0IHBpcGVEZWY6IFBpcGVEZWY8YW55PjtcbiAgY29uc3QgYWRqdXN0ZWRJbmRleCA9IGluZGV4ICsgSEVBREVSX09GRlNFVDtcblxuICBpZiAodFZpZXcuZmlyc3RDcmVhdGVQYXNzKSB7XG4gICAgLy8gVGhlIGBnZXRQaXBlRGVmYCB0aHJvd3MgaWYgYSBwaXBlIHdpdGggYSBnaXZlbiBuYW1lIGlzIG5vdCBmb3VuZFxuICAgIC8vIChzbyB3ZSB1c2Ugbm9uLW51bGwgYXNzZXJ0aW9uIGJlbG93KS5cbiAgICBwaXBlRGVmID0gZ2V0UGlwZURlZihwaXBlTmFtZSwgdFZpZXcucGlwZVJlZ2lzdHJ5KSE7XG4gICAgdFZpZXcuZGF0YVthZGp1c3RlZEluZGV4XSA9IHBpcGVEZWY7XG4gICAgaWYgKHBpcGVEZWYub25EZXN0cm95KSB7XG4gICAgICAodFZpZXcuZGVzdHJveUhvb2tzIHx8ICh0Vmlldy5kZXN0cm95SG9va3MgPSBbXSkpLnB1c2goYWRqdXN0ZWRJbmRleCwgcGlwZURlZi5vbkRlc3Ryb3kpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwaXBlRGVmID0gdFZpZXcuZGF0YVthZGp1c3RlZEluZGV4XSBhcyBQaXBlRGVmPGFueT47XG4gIH1cblxuICBjb25zdCBwaXBlRmFjdG9yeSA9IHBpcGVEZWYuZmFjdG9yeSB8fCAocGlwZURlZi5mYWN0b3J5ID0gZ2V0RmFjdG9yeURlZihwaXBlRGVmLnR5cGUsIHRydWUpKTtcbiAgY29uc3QgcHJldmlvdXNJbmplY3RJbXBsZW1lbnRhdGlvbiA9IHNldEluamVjdEltcGxlbWVudGF0aW9uKMm1ybVkaXJlY3RpdmVJbmplY3QpO1xuICB0cnkge1xuICAgIC8vIERJIGZvciBwaXBlcyBpcyBzdXBwb3NlZCB0byBiZWhhdmUgbGlrZSBkaXJlY3RpdmVzIHdoZW4gcGxhY2VkIG9uIGEgY29tcG9uZW50XG4gICAgLy8gaG9zdCBub2RlLCB3aGljaCBtZWFucyB0aGF0IHdlIGhhdmUgdG8gZGlzYWJsZSBhY2Nlc3MgdG8gYHZpZXdQcm92aWRlcnNgLlxuICAgIGNvbnN0IHByZXZpb3VzSW5jbHVkZVZpZXdQcm92aWRlcnMgPSBzZXRJbmNsdWRlVmlld1Byb3ZpZGVycyhmYWxzZSk7XG4gICAgY29uc3QgcGlwZUluc3RhbmNlID0gcGlwZUZhY3RvcnkoKTtcbiAgICBzZXRJbmNsdWRlVmlld1Byb3ZpZGVycyhwcmV2aW91c0luY2x1ZGVWaWV3UHJvdmlkZXJzKTtcbiAgICBzdG9yZSh0VmlldywgZ2V0TFZpZXcoKSwgYWRqdXN0ZWRJbmRleCwgcGlwZUluc3RhbmNlKTtcbiAgICByZXR1cm4gcGlwZUluc3RhbmNlO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIHdlIGhhdmUgdG8gcmVzdG9yZSB0aGUgaW5qZWN0b3IgaW1wbGVtZW50YXRpb24gaW4gZmluYWxseSwganVzdCBpbiBjYXNlIHRoZSBjcmVhdGlvbiBvZiB0aGVcbiAgICAvLyBwaXBlIHRocm93cyBhbiBlcnJvci5cbiAgICBzZXRJbmplY3RJbXBsZW1lbnRhdGlvbihwcmV2aW91c0luamVjdEltcGxlbWVudGF0aW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIFNlYXJjaGVzIHRoZSBwaXBlIHJlZ2lzdHJ5IGZvciBhIHBpcGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS4gSWYgb25lIGlzIGZvdW5kLFxuICogcmV0dXJucyB0aGUgcGlwZS4gT3RoZXJ3aXNlLCBhbiBlcnJvciBpcyB0aHJvd24gYmVjYXVzZSB0aGUgcGlwZSBjYW5ub3QgYmUgcmVzb2x2ZWQuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiBwaXBlIHRvIHJlc29sdmVcbiAqIEBwYXJhbSByZWdpc3RyeSBGdWxsIGxpc3Qgb2YgYXZhaWxhYmxlIHBpcGVzXG4gKiBAcmV0dXJucyBNYXRjaGluZyBQaXBlRGVmXG4gKi9cbmZ1bmN0aW9uIGdldFBpcGVEZWYobmFtZTogc3RyaW5nLCByZWdpc3RyeTogUGlwZURlZkxpc3R8bnVsbCk6IFBpcGVEZWY8YW55Pnx1bmRlZmluZWQge1xuICBpZiAocmVnaXN0cnkpIHtcbiAgICBmb3IgKGxldCBpID0gcmVnaXN0cnkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IHBpcGVEZWYgPSByZWdpc3RyeVtpXTtcbiAgICAgIGlmIChuYW1lID09PSBwaXBlRGVmLm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHBpcGVEZWY7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChuZ0Rldk1vZGUpIHtcbiAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFJ1bnRpbWVFcnJvckNvZGUuUElQRV9OT1RfRk9VTkQsIGdldFBpcGVOb3RGb3VuZEVycm9yTWVzc2FnZShuYW1lKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBoZWxwZnVsIGVycm9yIG1lc3NhZ2UgZm9yIHRoZSB1c2VyIHdoZW4gYSBwaXBlIGlzIG5vdCBmb3VuZC5cbiAqXG4gKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBtaXNzaW5nIHBpcGVcbiAqIEByZXR1cm5zIFRoZSBlcnJvciBtZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIGdldFBpcGVOb3RGb3VuZEVycm9yTWVzc2FnZShuYW1lOiBzdHJpbmcpIHtcbiAgY29uc3QgbFZpZXcgPSBnZXRMVmlldygpO1xuICBjb25zdCBkZWNsYXJhdGlvbkxWaWV3ID0gbFZpZXdbREVDTEFSQVRJT05fQ09NUE9ORU5UX1ZJRVddIGFzIExWaWV3PFR5cGU8dW5rbm93bj4+O1xuICBjb25zdCBjb250ZXh0ID0gZGVjbGFyYXRpb25MVmlld1tDT05URVhUXTtcbiAgY29uc3QgaG9zdElzU3RhbmRhbG9uZSA9IGlzSG9zdENvbXBvbmVudFN0YW5kYWxvbmUobFZpZXcpO1xuICBjb25zdCBjb21wb25lbnRJbmZvTWVzc2FnZSA9IGNvbnRleHQgPyBgIGluIHRoZSAnJHtjb250ZXh0LmNvbnN0cnVjdG9yLm5hbWV9JyBjb21wb25lbnRgIDogJyc7XG4gIGNvbnN0IHZlcmlmeU1lc3NhZ2UgPSBgVmVyaWZ5IHRoYXQgaXQgaXMgJHtcbiAgICAgIGhvc3RJc1N0YW5kYWxvbmUgPyAnaW5jbHVkZWQgaW4gdGhlIFxcJ0BDb21wb25lbnQuaW1wb3J0c1xcJyBvZiB0aGlzIGNvbXBvbmVudCcgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICdkZWNsYXJlZCBvciBpbXBvcnRlZCBpbiB0aGlzIG1vZHVsZSd9YDtcbiAgY29uc3QgZXJyb3JNZXNzYWdlID1cbiAgICAgIGBUaGUgcGlwZSAnJHtuYW1lfScgY291bGQgbm90IGJlIGZvdW5kJHtjb21wb25lbnRJbmZvTWVzc2FnZX0uICR7dmVyaWZ5TWVzc2FnZX1gO1xuICByZXR1cm4gZXJyb3JNZXNzYWdlO1xufVxuXG4vKipcbiAqIEludm9rZXMgYSBwaXBlIHdpdGggMSBhcmd1bWVudHMuXG4gKlxuICogVGhpcyBpbnN0cnVjdGlvbiBhY3RzIGFzIGEgZ3VhcmQgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfSBpbnZva2luZ1xuICogdGhlIHBpcGUgb25seSB3aGVuIGFuIGlucHV0IHRvIHRoZSBwaXBlIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIGluZGV4IFBpcGUgaW5kZXggd2hlcmUgdGhlIHBpcGUgd2FzIHN0b3JlZCBvbiBjcmVhdGlvbi5cbiAqIEBwYXJhbSBzbG90T2Zmc2V0IHRoZSBvZmZzZXQgaW4gdGhlIHJlc2VydmVkIHNsb3Qgc3BhY2VcbiAqIEBwYXJhbSB2MSAxc3QgYXJndW1lbnQgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfS5cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtXBpcGVCaW5kMShpbmRleDogbnVtYmVyLCBzbG90T2Zmc2V0OiBudW1iZXIsIHYxOiBhbnkpOiBhbnkge1xuICBjb25zdCBhZGp1c3RlZEluZGV4ID0gaW5kZXggKyBIRUFERVJfT0ZGU0VUO1xuICBjb25zdCBsVmlldyA9IGdldExWaWV3KCk7XG4gIGNvbnN0IHBpcGVJbnN0YW5jZSA9IGxvYWQ8UGlwZVRyYW5zZm9ybT4obFZpZXcsIGFkanVzdGVkSW5kZXgpO1xuICByZXR1cm4gaXNQdXJlKGxWaWV3LCBhZGp1c3RlZEluZGV4KSA/XG4gICAgICBwdXJlRnVuY3Rpb24xSW50ZXJuYWwoXG4gICAgICAgICAgbFZpZXcsIGdldEJpbmRpbmdSb290KCksIHNsb3RPZmZzZXQsIHBpcGVJbnN0YW5jZS50cmFuc2Zvcm0sIHYxLCBwaXBlSW5zdGFuY2UpIDpcbiAgICAgIHBpcGVJbnN0YW5jZS50cmFuc2Zvcm0odjEpO1xufVxuXG4vKipcbiAqIEludm9rZXMgYSBwaXBlIHdpdGggMiBhcmd1bWVudHMuXG4gKlxuICogVGhpcyBpbnN0cnVjdGlvbiBhY3RzIGFzIGEgZ3VhcmQgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfSBpbnZva2luZ1xuICogdGhlIHBpcGUgb25seSB3aGVuIGFuIGlucHV0IHRvIHRoZSBwaXBlIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIGluZGV4IFBpcGUgaW5kZXggd2hlcmUgdGhlIHBpcGUgd2FzIHN0b3JlZCBvbiBjcmVhdGlvbi5cbiAqIEBwYXJhbSBzbG90T2Zmc2V0IHRoZSBvZmZzZXQgaW4gdGhlIHJlc2VydmVkIHNsb3Qgc3BhY2VcbiAqIEBwYXJhbSB2MSAxc3QgYXJndW1lbnQgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfS5cbiAqIEBwYXJhbSB2MiAybmQgYXJndW1lbnQgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfS5cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtXBpcGVCaW5kMihpbmRleDogbnVtYmVyLCBzbG90T2Zmc2V0OiBudW1iZXIsIHYxOiBhbnksIHYyOiBhbnkpOiBhbnkge1xuICBjb25zdCBhZGp1c3RlZEluZGV4ID0gaW5kZXggKyBIRUFERVJfT0ZGU0VUO1xuICBjb25zdCBsVmlldyA9IGdldExWaWV3KCk7XG4gIGNvbnN0IHBpcGVJbnN0YW5jZSA9IGxvYWQ8UGlwZVRyYW5zZm9ybT4obFZpZXcsIGFkanVzdGVkSW5kZXgpO1xuICByZXR1cm4gaXNQdXJlKGxWaWV3LCBhZGp1c3RlZEluZGV4KSA/XG4gICAgICBwdXJlRnVuY3Rpb24ySW50ZXJuYWwoXG4gICAgICAgICAgbFZpZXcsIGdldEJpbmRpbmdSb290KCksIHNsb3RPZmZzZXQsIHBpcGVJbnN0YW5jZS50cmFuc2Zvcm0sIHYxLCB2MiwgcGlwZUluc3RhbmNlKSA6XG4gICAgICBwaXBlSW5zdGFuY2UudHJhbnNmb3JtKHYxLCB2Mik7XG59XG5cbi8qKlxuICogSW52b2tlcyBhIHBpcGUgd2l0aCAzIGFyZ3VtZW50cy5cbiAqXG4gKiBUaGlzIGluc3RydWN0aW9uIGFjdHMgYXMgYSBndWFyZCB0byB7QGxpbmsgUGlwZVRyYW5zZm9ybSN0cmFuc2Zvcm19IGludm9raW5nXG4gKiB0aGUgcGlwZSBvbmx5IHdoZW4gYW4gaW5wdXQgdG8gdGhlIHBpcGUgY2hhbmdlcy5cbiAqXG4gKiBAcGFyYW0gaW5kZXggUGlwZSBpbmRleCB3aGVyZSB0aGUgcGlwZSB3YXMgc3RvcmVkIG9uIGNyZWF0aW9uLlxuICogQHBhcmFtIHNsb3RPZmZzZXQgdGhlIG9mZnNldCBpbiB0aGUgcmVzZXJ2ZWQgc2xvdCBzcGFjZVxuICogQHBhcmFtIHYxIDFzdCBhcmd1bWVudCB0byB7QGxpbmsgUGlwZVRyYW5zZm9ybSN0cmFuc2Zvcm19LlxuICogQHBhcmFtIHYyIDJuZCBhcmd1bWVudCB0byB7QGxpbmsgUGlwZVRyYW5zZm9ybSN0cmFuc2Zvcm19LlxuICogQHBhcmFtIHYzIDRyZCBhcmd1bWVudCB0byB7QGxpbmsgUGlwZVRyYW5zZm9ybSN0cmFuc2Zvcm19LlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1cGlwZUJpbmQzKGluZGV4OiBudW1iZXIsIHNsb3RPZmZzZXQ6IG51bWJlciwgdjE6IGFueSwgdjI6IGFueSwgdjM6IGFueSk6IGFueSB7XG4gIGNvbnN0IGFkanVzdGVkSW5kZXggPSBpbmRleCArIEhFQURFUl9PRkZTRVQ7XG4gIGNvbnN0IGxWaWV3ID0gZ2V0TFZpZXcoKTtcbiAgY29uc3QgcGlwZUluc3RhbmNlID0gbG9hZDxQaXBlVHJhbnNmb3JtPihsVmlldywgYWRqdXN0ZWRJbmRleCk7XG4gIHJldHVybiBpc1B1cmUobFZpZXcsIGFkanVzdGVkSW5kZXgpID9cbiAgICAgIHB1cmVGdW5jdGlvbjNJbnRlcm5hbChcbiAgICAgICAgICBsVmlldywgZ2V0QmluZGluZ1Jvb3QoKSwgc2xvdE9mZnNldCwgcGlwZUluc3RhbmNlLnRyYW5zZm9ybSwgdjEsIHYyLCB2MywgcGlwZUluc3RhbmNlKSA6XG4gICAgICBwaXBlSW5zdGFuY2UudHJhbnNmb3JtKHYxLCB2MiwgdjMpO1xufVxuXG4vKipcbiAqIEludm9rZXMgYSBwaXBlIHdpdGggNCBhcmd1bWVudHMuXG4gKlxuICogVGhpcyBpbnN0cnVjdGlvbiBhY3RzIGFzIGEgZ3VhcmQgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfSBpbnZva2luZ1xuICogdGhlIHBpcGUgb25seSB3aGVuIGFuIGlucHV0IHRvIHRoZSBwaXBlIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIGluZGV4IFBpcGUgaW5kZXggd2hlcmUgdGhlIHBpcGUgd2FzIHN0b3JlZCBvbiBjcmVhdGlvbi5cbiAqIEBwYXJhbSBzbG90T2Zmc2V0IHRoZSBvZmZzZXQgaW4gdGhlIHJlc2VydmVkIHNsb3Qgc3BhY2VcbiAqIEBwYXJhbSB2MSAxc3QgYXJndW1lbnQgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfS5cbiAqIEBwYXJhbSB2MiAybmQgYXJndW1lbnQgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfS5cbiAqIEBwYXJhbSB2MyAzcmQgYXJndW1lbnQgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfS5cbiAqIEBwYXJhbSB2NCA0dGggYXJndW1lbnQgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfS5cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtXBpcGVCaW5kNChcbiAgICBpbmRleDogbnVtYmVyLCBzbG90T2Zmc2V0OiBudW1iZXIsIHYxOiBhbnksIHYyOiBhbnksIHYzOiBhbnksIHY0OiBhbnkpOiBhbnkge1xuICBjb25zdCBhZGp1c3RlZEluZGV4ID0gaW5kZXggKyBIRUFERVJfT0ZGU0VUO1xuICBjb25zdCBsVmlldyA9IGdldExWaWV3KCk7XG4gIGNvbnN0IHBpcGVJbnN0YW5jZSA9IGxvYWQ8UGlwZVRyYW5zZm9ybT4obFZpZXcsIGFkanVzdGVkSW5kZXgpO1xuICByZXR1cm4gaXNQdXJlKGxWaWV3LCBhZGp1c3RlZEluZGV4KSA/IHB1cmVGdW5jdGlvbjRJbnRlcm5hbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbFZpZXcsIGdldEJpbmRpbmdSb290KCksIHNsb3RPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVJbnN0YW5jZS50cmFuc2Zvcm0sIHYxLCB2MiwgdjMsIHY0LCBwaXBlSW5zdGFuY2UpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXBlSW5zdGFuY2UudHJhbnNmb3JtKHYxLCB2MiwgdjMsIHY0KTtcbn1cblxuLyoqXG4gKiBJbnZva2VzIGEgcGlwZSB3aXRoIHZhcmlhYmxlIG51bWJlciBvZiBhcmd1bWVudHMuXG4gKlxuICogVGhpcyBpbnN0cnVjdGlvbiBhY3RzIGFzIGEgZ3VhcmQgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfSBpbnZva2luZ1xuICogdGhlIHBpcGUgb25seSB3aGVuIGFuIGlucHV0IHRvIHRoZSBwaXBlIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIGluZGV4IFBpcGUgaW5kZXggd2hlcmUgdGhlIHBpcGUgd2FzIHN0b3JlZCBvbiBjcmVhdGlvbi5cbiAqIEBwYXJhbSBzbG90T2Zmc2V0IHRoZSBvZmZzZXQgaW4gdGhlIHJlc2VydmVkIHNsb3Qgc3BhY2VcbiAqIEBwYXJhbSB2YWx1ZXMgQXJyYXkgb2YgYXJndW1lbnRzIHRvIHBhc3MgdG8ge0BsaW5rIFBpcGVUcmFuc2Zvcm0jdHJhbnNmb3JtfSBtZXRob2QuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVwaXBlQmluZFYoaW5kZXg6IG51bWJlciwgc2xvdE9mZnNldDogbnVtYmVyLCB2YWx1ZXM6IFthbnksIC4uLmFueVtdXSk6IGFueSB7XG4gIGNvbnN0IGFkanVzdGVkSW5kZXggPSBpbmRleCArIEhFQURFUl9PRkZTRVQ7XG4gIGNvbnN0IGxWaWV3ID0gZ2V0TFZpZXcoKTtcbiAgY29uc3QgcGlwZUluc3RhbmNlID0gbG9hZDxQaXBlVHJhbnNmb3JtPihsVmlldywgYWRqdXN0ZWRJbmRleCk7XG4gIHJldHVybiBpc1B1cmUobFZpZXcsIGFkanVzdGVkSW5kZXgpID9cbiAgICAgIHB1cmVGdW5jdGlvblZJbnRlcm5hbChcbiAgICAgICAgICBsVmlldywgZ2V0QmluZGluZ1Jvb3QoKSwgc2xvdE9mZnNldCwgcGlwZUluc3RhbmNlLnRyYW5zZm9ybSwgdmFsdWVzLCBwaXBlSW5zdGFuY2UpIDpcbiAgICAgIHBpcGVJbnN0YW5jZS50cmFuc2Zvcm0uYXBwbHkocGlwZUluc3RhbmNlLCB2YWx1ZXMpO1xufVxuXG5mdW5jdGlvbiBpc1B1cmUobFZpZXc6IExWaWV3LCBpbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAoPFBpcGVEZWY8YW55Pj5sVmlld1tUVklFV10uZGF0YVtpbmRleF0pLnB1cmU7XG59XG4iXX0=