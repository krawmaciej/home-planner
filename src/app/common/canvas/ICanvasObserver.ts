
export const registerObserver = (currentObservers: Array<ICanvasObserver>, newObserver: ICanvasObserver) => {
    currentObservers.push(newObserver);
};

export const deregisterObserver = (currentObservers: Array<ICanvasObserver>, toRemove: ICanvasObserver) => {
    const indexOf = currentObservers.indexOf(toRemove);
    if (indexOf !== -1) {
        currentObservers.splice(indexOf, 1);
    }
};

export interface ICanvasObserver {
    beforeRender(): void;
}
