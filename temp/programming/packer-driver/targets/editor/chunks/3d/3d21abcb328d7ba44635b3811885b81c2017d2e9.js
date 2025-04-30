System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, ObjectPool, _crd;

  _export("ObjectPool", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c1637NkGRFB9pix3svAhjlN", "object-pool", undefined);

      _export("ObjectPool", ObjectPool = class ObjectPool {
        static _getItemArray(ctor) {
          let itemArray;

          if (ObjectPool._itemArrayMap.has(ctor)) {
            itemArray = ObjectPool._itemArrayMap.get(ctor);
          } else {
            itemArray = [];

            ObjectPool._itemArrayMap.set(ctor, itemArray);
          }

          return itemArray;
        }

        static init() {
          ObjectPool._initMap.forEach((count, clazz) => {
            const itemArray = ObjectPool._getItemArray(clazz);

            for (let index = 0; index < count; index++) {
              itemArray.push(new clazz());
            }
          });

          ObjectPool._initMap.clear();
        }

        static allocate(ctor, ...args) {
          const itemArray = ObjectPool._getItemArray(ctor);

          let item;

          if (itemArray.length) {
            item = itemArray.pop();
          } else {
            item = new ctor();
          }

          item.initialize == null || item.initialize(...args);
          return item;
        }

        static clear(ctor) {
          ObjectPool._initMap.clear();

          ObjectPool._getItemArray(ctor).forEach(i => i.release == null ? void 0 : i.release());

          ObjectPool._getItemArray(ctor).length = 0;
        }

        static register(maxSize = 128, initSize = 0) {
          return function (ctor) {
            const clazz = class extends ctor {
              release(...args) {
                super.release == null || super.release(...args);

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

      });

      ObjectPool._itemArrayMap = new WeakMap();
      ObjectPool._initMap = new Map();

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3d21abcb328d7ba44635b3811885b81c2017d2e9.js.map