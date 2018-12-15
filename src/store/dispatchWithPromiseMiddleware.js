export function dispatchWithPromise(effects) {
    return () => next => action => {
        const {type} = action;
        if (effects.find(item => item === type)) {
            return new Promise((resolve, reject) => {
                next({
                    resolve,
                    reject,
                    ...action,
                });
            });
        } else {
            return next(action);
        }
    };
}


