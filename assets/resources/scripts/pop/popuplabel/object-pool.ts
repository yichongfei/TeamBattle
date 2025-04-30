export class ObjectPool {
    private static _itemArrayMap: WeakMap<PoolItemCtor, PoolItem[]> = new WeakMap();

    private static _initMap: Map<PoolItemCtor, number> = new Map();

    private static _getItemArray(ctor: PoolItemCtor) {
        let itemArray: PoolItem[];
        if (ObjectPool._itemArrayMap.has(ctor)) {
            itemArray = ObjectPool._itemArrayMap.get(ctor);
        } else {
            itemArray = [];
            ObjectPool._itemArrayMap.set(ctor, itemArray);
        }
        return itemArray;
    }

    public static init() {
        ObjectPool._initMap.forEach((count, clazz) => {
            const itemArray = ObjectPool._getItemArray(clazz);
            for (let index = 0; index < count; index++) {
                itemArray.push(new clazz());
            }
        });
        ObjectPool._initMap.clear();
    }

    public static allocate<T extends PoolItem>(
        ctor: Ctor<T>,
        ...args: Parameters<T["initialize"]>
    ): T {
        const itemArray = ObjectPool._getItemArray(ctor);
        let item: T;
        if (itemArray.length) {
            item = <T>itemArray.pop();
        } else {
            item = <T>new ctor();
        }
        item.initialize?.(...args);
        return item;
    }

    public static clear(ctor: PoolItemCtor) {
        ObjectPool._initMap.clear();
        ObjectPool._getItemArray(ctor).forEach(i => i.release?.());
        ObjectPool._getItemArray(ctor).length = 0;
    }

    public static register(maxSize = 128, initSize = 0) {
        return function <T extends PoolItemCtor>(ctor: T) {
            const clazz = class extends ctor {
                public release(...args: any[]) {
                    super.release?.(...args);
                    const itemArray = ObjectPool._getItemArray(clazz);
                    if (itemArray.length < maxSize) {
                        ObjectPool._getItemArray(clazz).push(this);
                    }
                }
            };
            if (initSize > 0) {
                ObjectPool._initMap.set(clazz, initSize);
            }
            return clazz;
        };
    }

}

export interface PoolItem {
    initialize?(...args: any[]): void;
    release(...args: any[]): void;
}

type Ctor<T = any> = new (...args: any[]) => T;

type PoolItemCtor = Ctor<PoolItem>;