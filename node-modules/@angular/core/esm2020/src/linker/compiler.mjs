/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '../di/injectable';
import { InjectionToken } from '../di/injection_token';
import { ComponentFactory as ComponentFactoryR3 } from '../render3/component_ref';
import { getComponentDef, getNgModuleDef } from '../render3/definition';
import { NgModuleFactory as NgModuleFactoryR3 } from '../render3/ng_module_ref';
import { maybeUnwrapFn } from '../render3/util/misc_utils';
import * as i0 from "../r3_symbols";
/**
 * Combination of NgModuleFactory and ComponentFactories.
 *
 * @publicApi
 *
 * @deprecated
 * Ivy JIT mode doesn't require accessing this symbol.
 * See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for
 * additional context.
 */
export class ModuleWithComponentFactories {
    constructor(ngModuleFactory, componentFactories) {
        this.ngModuleFactory = ngModuleFactory;
        this.componentFactories = componentFactories;
    }
}
/**
 * Low-level service for running the angular compiler during runtime
 * to create {@link ComponentFactory}s, which
 * can later be used to create and render a Component instance.
 *
 * Each `@NgModule` provides an own `Compiler` to its injector,
 * that will use the directives/pipes of the ng module for compilation
 * of components.
 *
 * @publicApi
 *
 * @deprecated
 * Ivy JIT mode doesn't require accessing this symbol.
 * See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for
 * additional context.
 */
export class Compiler {
    /**
     * Compiles the given NgModule and all of its components. All templates of the components listed
     * in `entryComponents` have to be inlined.
     */
    compileModuleSync(moduleType) {
        return new NgModuleFactoryR3(moduleType);
    }
    /**
     * Compiles the given NgModule and all of its components
     */
    compileModuleAsync(moduleType) {
        return Promise.resolve(this.compileModuleSync(moduleType));
    }
    /**
     * Same as {@link #compileModuleSync} but also creates ComponentFactories for all components.
     */
    compileModuleAndAllComponentsSync(moduleType) {
        const ngModuleFactory = this.compileModuleSync(moduleType);
        const moduleDef = getNgModuleDef(moduleType);
        const componentFactories = maybeUnwrapFn(moduleDef.declarations)
            .reduce((factories, declaration) => {
            const componentDef = getComponentDef(declaration);
            componentDef && factories.push(new ComponentFactoryR3(componentDef));
            return factories;
        }, []);
        return new ModuleWithComponentFactories(ngModuleFactory, componentFactories);
    }
    /**
     * Same as {@link #compileModuleAsync} but also creates ComponentFactories for all components.
     */
    compileModuleAndAllComponentsAsync(moduleType) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(moduleType));
    }
    /**
     * Clears all caches.
     */
    clearCache() { }
    /**
     * Clears the cache for the given component/ngModule.
     */
    clearCacheFor(type) { }
    /**
     * Returns the id for a given NgModule, if one is defined and known to the compiler.
     */
    getModuleId(moduleType) {
        return undefined;
    }
}
Compiler.ɵfac = function Compiler_Factory(t) { return new (t || Compiler)(); };
Compiler.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: Compiler, factory: Compiler.ɵfac, providedIn: 'root' });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.setClassMetadata(Compiler, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
/**
 * Token to provide CompilerOptions in the platform injector.
 *
 * @publicApi
 */
export const COMPILER_OPTIONS = new InjectionToken('compilerOptions');
/**
 * A factory for creating a Compiler
 *
 * @publicApi
 *
 * @deprecated
 * Ivy JIT mode doesn't require accessing this symbol.
 * See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for
 * additional context.
 */
export class CompilerFactory {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9saW5rZXIvY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUtyRCxPQUFPLEVBQUMsZ0JBQWdCLElBQUksa0JBQWtCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRixPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3RFLE9BQU8sRUFBQyxlQUFlLElBQUksaUJBQWlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM5RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7O0FBS3pEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sT0FBTyw0QkFBNEI7SUFDdkMsWUFDVyxlQUFtQyxFQUNuQyxrQkFBMkM7UUFEM0Msb0JBQWUsR0FBZixlQUFlLENBQW9CO1FBQ25DLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBeUI7SUFBRyxDQUFDO0NBQzNEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsTUFBTSxPQUFPLFFBQVE7SUFDbkI7OztPQUdHO0lBQ0gsaUJBQWlCLENBQUksVUFBbUI7UUFDdEMsT0FBTyxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7T0FFRztJQUNILGtCQUFrQixDQUFJLFVBQW1CO1FBQ3ZDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxpQ0FBaUMsQ0FBSSxVQUFtQjtRQUN0RCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0QsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBRSxDQUFDO1FBQzlDLE1BQU0sa0JBQWtCLEdBQ3BCLGFBQWEsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDO2FBQ2hDLE1BQU0sQ0FBQyxDQUFDLFNBQWtDLEVBQUUsV0FBc0IsRUFBRSxFQUFFO1lBQ3JFLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRCxZQUFZLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDckUsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQyxFQUFFLEVBQTZCLENBQUMsQ0FBQztRQUMxQyxPQUFPLElBQUksNEJBQTRCLENBQUMsZUFBZSxFQUFFLGtCQUFrQixDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVEOztPQUVHO0lBQ0gsa0NBQWtDLENBQUksVUFBbUI7UUFFdkQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRDs7T0FFRztJQUNILFVBQVUsS0FBVSxDQUFDO0lBRXJCOztPQUVHO0lBQ0gsYUFBYSxDQUFDLElBQWUsSUFBRyxDQUFDO0lBRWpDOztPQUVHO0lBQ0gsV0FBVyxDQUFDLFVBQXFCO1FBQy9CLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7O2dFQXZEVSxRQUFROzhEQUFSLFFBQVEsV0FBUixRQUFRLG1CQURJLE1BQU07c0ZBQ2xCLFFBQVE7Y0FEcEIsVUFBVTtlQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUFpRmhDOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGNBQWMsQ0FBb0IsaUJBQWlCLENBQUMsQ0FBQztBQUV6Rjs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLE9BQWdCLGVBQWU7Q0FFcEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICcuLi9kaS9pbmplY3RhYmxlJztcbmltcG9ydCB7SW5qZWN0aW9uVG9rZW59IGZyb20gJy4uL2RpL2luamVjdGlvbl90b2tlbic7XG5pbXBvcnQge1N0YXRpY1Byb3ZpZGVyfSBmcm9tICcuLi9kaS9pbnRlcmZhY2UvcHJvdmlkZXInO1xuaW1wb3J0IHtNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneX0gZnJvbSAnLi4vaTE4bi90b2tlbnMnO1xuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi9pbnRlcmZhY2UvdHlwZSc7XG5pbXBvcnQge1ZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICcuLi9tZXRhZGF0YS92aWV3JztcbmltcG9ydCB7Q29tcG9uZW50RmFjdG9yeSBhcyBDb21wb25lbnRGYWN0b3J5UjN9IGZyb20gJy4uL3JlbmRlcjMvY29tcG9uZW50X3JlZic7XG5pbXBvcnQge2dldENvbXBvbmVudERlZiwgZ2V0TmdNb2R1bGVEZWZ9IGZyb20gJy4uL3JlbmRlcjMvZGVmaW5pdGlvbic7XG5pbXBvcnQge05nTW9kdWxlRmFjdG9yeSBhcyBOZ01vZHVsZUZhY3RvcnlSM30gZnJvbSAnLi4vcmVuZGVyMy9uZ19tb2R1bGVfcmVmJztcbmltcG9ydCB7bWF5YmVVbndyYXBGbn0gZnJvbSAnLi4vcmVuZGVyMy91dGlsL21pc2NfdXRpbHMnO1xuXG5pbXBvcnQge0NvbXBvbmVudEZhY3Rvcnl9IGZyb20gJy4vY29tcG9uZW50X2ZhY3RvcnknO1xuaW1wb3J0IHtOZ01vZHVsZUZhY3Rvcnl9IGZyb20gJy4vbmdfbW9kdWxlX2ZhY3RvcnknO1xuXG4vKipcbiAqIENvbWJpbmF0aW9uIG9mIE5nTW9kdWxlRmFjdG9yeSBhbmQgQ29tcG9uZW50RmFjdG9yaWVzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqXG4gKiBAZGVwcmVjYXRlZFxuICogSXZ5IEpJVCBtb2RlIGRvZXNuJ3QgcmVxdWlyZSBhY2Nlc3NpbmcgdGhpcyBzeW1ib2wuXG4gKiBTZWUgW0pJVCBBUEkgY2hhbmdlcyBkdWUgdG8gVmlld0VuZ2luZSBkZXByZWNhdGlvbl0oZ3VpZGUvZGVwcmVjYXRpb25zI2ppdC1hcGktY2hhbmdlcykgZm9yXG4gKiBhZGRpdGlvbmFsIGNvbnRleHQuXG4gKi9cbmV4cG9ydCBjbGFzcyBNb2R1bGVXaXRoQ29tcG9uZW50RmFjdG9yaWVzPFQ+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgbmdNb2R1bGVGYWN0b3J5OiBOZ01vZHVsZUZhY3Rvcnk8VD4sXG4gICAgICBwdWJsaWMgY29tcG9uZW50RmFjdG9yaWVzOiBDb21wb25lbnRGYWN0b3J5PGFueT5bXSkge31cbn1cblxuLyoqXG4gKiBMb3ctbGV2ZWwgc2VydmljZSBmb3IgcnVubmluZyB0aGUgYW5ndWxhciBjb21waWxlciBkdXJpbmcgcnVudGltZVxuICogdG8gY3JlYXRlIHtAbGluayBDb21wb25lbnRGYWN0b3J5fXMsIHdoaWNoXG4gKiBjYW4gbGF0ZXIgYmUgdXNlZCB0byBjcmVhdGUgYW5kIHJlbmRlciBhIENvbXBvbmVudCBpbnN0YW5jZS5cbiAqXG4gKiBFYWNoIGBATmdNb2R1bGVgIHByb3ZpZGVzIGFuIG93biBgQ29tcGlsZXJgIHRvIGl0cyBpbmplY3RvcixcbiAqIHRoYXQgd2lsbCB1c2UgdGhlIGRpcmVjdGl2ZXMvcGlwZXMgb2YgdGhlIG5nIG1vZHVsZSBmb3IgY29tcGlsYXRpb25cbiAqIG9mIGNvbXBvbmVudHMuXG4gKlxuICogQHB1YmxpY0FwaVxuICpcbiAqIEBkZXByZWNhdGVkXG4gKiBJdnkgSklUIG1vZGUgZG9lc24ndCByZXF1aXJlIGFjY2Vzc2luZyB0aGlzIHN5bWJvbC5cbiAqIFNlZSBbSklUIEFQSSBjaGFuZ2VzIGR1ZSB0byBWaWV3RW5naW5lIGRlcHJlY2F0aW9uXShndWlkZS9kZXByZWNhdGlvbnMjaml0LWFwaS1jaGFuZ2VzKSBmb3JcbiAqIGFkZGl0aW9uYWwgY29udGV4dC5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgQ29tcGlsZXIge1xuICAvKipcbiAgICogQ29tcGlsZXMgdGhlIGdpdmVuIE5nTW9kdWxlIGFuZCBhbGwgb2YgaXRzIGNvbXBvbmVudHMuIEFsbCB0ZW1wbGF0ZXMgb2YgdGhlIGNvbXBvbmVudHMgbGlzdGVkXG4gICAqIGluIGBlbnRyeUNvbXBvbmVudHNgIGhhdmUgdG8gYmUgaW5saW5lZC5cbiAgICovXG4gIGNvbXBpbGVNb2R1bGVTeW5jPFQ+KG1vZHVsZVR5cGU6IFR5cGU8VD4pOiBOZ01vZHVsZUZhY3Rvcnk8VD4ge1xuICAgIHJldHVybiBuZXcgTmdNb2R1bGVGYWN0b3J5UjMobW9kdWxlVHlwZSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGlsZXMgdGhlIGdpdmVuIE5nTW9kdWxlIGFuZCBhbGwgb2YgaXRzIGNvbXBvbmVudHNcbiAgICovXG4gIGNvbXBpbGVNb2R1bGVBc3luYzxUPihtb2R1bGVUeXBlOiBUeXBlPFQ+KTogUHJvbWlzZTxOZ01vZHVsZUZhY3Rvcnk8VD4+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuY29tcGlsZU1vZHVsZVN5bmMobW9kdWxlVHlwZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhbWUgYXMge0BsaW5rICNjb21waWxlTW9kdWxlU3luY30gYnV0IGFsc28gY3JlYXRlcyBDb21wb25lbnRGYWN0b3JpZXMgZm9yIGFsbCBjb21wb25lbnRzLlxuICAgKi9cbiAgY29tcGlsZU1vZHVsZUFuZEFsbENvbXBvbmVudHNTeW5jPFQ+KG1vZHVsZVR5cGU6IFR5cGU8VD4pOiBNb2R1bGVXaXRoQ29tcG9uZW50RmFjdG9yaWVzPFQ+IHtcbiAgICBjb25zdCBuZ01vZHVsZUZhY3RvcnkgPSB0aGlzLmNvbXBpbGVNb2R1bGVTeW5jKG1vZHVsZVR5cGUpO1xuICAgIGNvbnN0IG1vZHVsZURlZiA9IGdldE5nTW9kdWxlRGVmKG1vZHVsZVR5cGUpITtcbiAgICBjb25zdCBjb21wb25lbnRGYWN0b3JpZXMgPVxuICAgICAgICBtYXliZVVud3JhcEZuKG1vZHVsZURlZi5kZWNsYXJhdGlvbnMpXG4gICAgICAgICAgICAucmVkdWNlKChmYWN0b3JpZXM6IENvbXBvbmVudEZhY3Rvcnk8YW55PltdLCBkZWNsYXJhdGlvbjogVHlwZTxhbnk+KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudERlZiA9IGdldENvbXBvbmVudERlZihkZWNsYXJhdGlvbik7XG4gICAgICAgICAgICAgIGNvbXBvbmVudERlZiAmJiBmYWN0b3JpZXMucHVzaChuZXcgQ29tcG9uZW50RmFjdG9yeVIzKGNvbXBvbmVudERlZikpO1xuICAgICAgICAgICAgICByZXR1cm4gZmFjdG9yaWVzO1xuICAgICAgICAgICAgfSwgW10gYXMgQ29tcG9uZW50RmFjdG9yeTxhbnk+W10pO1xuICAgIHJldHVybiBuZXcgTW9kdWxlV2l0aENvbXBvbmVudEZhY3RvcmllcyhuZ01vZHVsZUZhY3RvcnksIGNvbXBvbmVudEZhY3Rvcmllcyk7XG4gIH1cblxuICAvKipcbiAgICogU2FtZSBhcyB7QGxpbmsgI2NvbXBpbGVNb2R1bGVBc3luY30gYnV0IGFsc28gY3JlYXRlcyBDb21wb25lbnRGYWN0b3JpZXMgZm9yIGFsbCBjb21wb25lbnRzLlxuICAgKi9cbiAgY29tcGlsZU1vZHVsZUFuZEFsbENvbXBvbmVudHNBc3luYzxUPihtb2R1bGVUeXBlOiBUeXBlPFQ+KTpcbiAgICAgIFByb21pc2U8TW9kdWxlV2l0aENvbXBvbmVudEZhY3RvcmllczxUPj4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5jb21waWxlTW9kdWxlQW5kQWxsQ29tcG9uZW50c1N5bmMobW9kdWxlVHlwZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyBhbGwgY2FjaGVzLlxuICAgKi9cbiAgY2xlYXJDYWNoZSgpOiB2b2lkIHt9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgY2FjaGUgZm9yIHRoZSBnaXZlbiBjb21wb25lbnQvbmdNb2R1bGUuXG4gICAqL1xuICBjbGVhckNhY2hlRm9yKHR5cGU6IFR5cGU8YW55Pikge31cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaWQgZm9yIGEgZ2l2ZW4gTmdNb2R1bGUsIGlmIG9uZSBpcyBkZWZpbmVkIGFuZCBrbm93biB0byB0aGUgY29tcGlsZXIuXG4gICAqL1xuICBnZXRNb2R1bGVJZChtb2R1bGVUeXBlOiBUeXBlPGFueT4pOiBzdHJpbmd8dW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgY3JlYXRpbmcgYSBjb21waWxlci5cbiAqXG4gKiBOb3RlOiB0aGUgYHVzZUppdGAgYW5kIGBtaXNzaW5nVHJhbnNsYXRpb25gIGNvbmZpZyBvcHRpb25zIGFyZSBub3QgdXNlZCBpbiBJdnksIHBhc3NpbmcgdGhlbSBoYXNcbiAqIG5vIGVmZmVjdC4gVGhvc2UgY29uZmlnIG9wdGlvbnMgYXJlIGRlcHJlY2F0ZWQgc2luY2UgdjEzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgQ29tcGlsZXJPcHRpb25zID0ge1xuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgbm90IHVzZWQgYXQgYWxsIGluIEl2eSwgcHJvdmlkaW5nIHRoaXMgY29uZmlnIG9wdGlvbiBoYXMgbm8gZWZmZWN0LlxuICAgKi9cbiAgdXNlSml0PzogYm9vbGVhbixcbiAgZGVmYXVsdEVuY2Fwc3VsYXRpb24/OiBWaWV3RW5jYXBzdWxhdGlvbixcbiAgcHJvdmlkZXJzPzogU3RhdGljUHJvdmlkZXJbXSxcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIG5vdCB1c2VkIGF0IGFsbCBpbiBJdnksIHByb3ZpZGluZyB0aGlzIGNvbmZpZyBvcHRpb24gaGFzIG5vIGVmZmVjdC5cbiAgICovXG4gIG1pc3NpbmdUcmFuc2xhdGlvbj86IE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5LFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzPzogYm9vbGVhbixcbn07XG5cbi8qKlxuICogVG9rZW4gdG8gcHJvdmlkZSBDb21waWxlck9wdGlvbnMgaW4gdGhlIHBsYXRmb3JtIGluamVjdG9yLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IENPTVBJTEVSX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48Q29tcGlsZXJPcHRpb25zW10+KCdjb21waWxlck9wdGlvbnMnKTtcblxuLyoqXG4gKiBBIGZhY3RvcnkgZm9yIGNyZWF0aW5nIGEgQ29tcGlsZXJcbiAqXG4gKiBAcHVibGljQXBpXG4gKlxuICogQGRlcHJlY2F0ZWRcbiAqIEl2eSBKSVQgbW9kZSBkb2Vzbid0IHJlcXVpcmUgYWNjZXNzaW5nIHRoaXMgc3ltYm9sLlxuICogU2VlIFtKSVQgQVBJIGNoYW5nZXMgZHVlIHRvIFZpZXdFbmdpbmUgZGVwcmVjYXRpb25dKGd1aWRlL2RlcHJlY2F0aW9ucyNqaXQtYXBpLWNoYW5nZXMpIGZvclxuICogYWRkaXRpb25hbCBjb250ZXh0LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29tcGlsZXJGYWN0b3J5IHtcbiAgYWJzdHJhY3QgY3JlYXRlQ29tcGlsZXIob3B0aW9ucz86IENvbXBpbGVyT3B0aW9uc1tdKTogQ29tcGlsZXI7XG59XG4iXX0=