System.register(["cc", "cc/env"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, approx, assert, BitmapFont, cclegacy, Component, Director, director, EPSILON, Game, game, gfx, ImageAsset, Label, Material, MotionStreak, murmurhash2_32_gc, renderer, resources, Root, Sprite, StencilManager, Texture2D, TiledLayer, DEBUG, EDITOR, JSB, _crd, VER, MAX_TEX, SUPPORT_NATIVE, MultBatch2D, _image, Texture, loadMultTextures, endBatcher, _cacheUseCount, _cacheMaterials, getMultMaterial, inject_Renderdata, inject_Label, inject_Sprite, inject_MotionStreak, inject_TiledLayer;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      approx = _cc.approx;
      assert = _cc.assert;
      BitmapFont = _cc.BitmapFont;
      cclegacy = _cc.cclegacy;
      Component = _cc.Component;
      Director = _cc.Director;
      director = _cc.director;
      EPSILON = _cc.EPSILON;
      Game = _cc.Game;
      game = _cc.game;
      gfx = _cc.gfx;
      ImageAsset = _cc.ImageAsset;
      Label = _cc.Label;
      Material = _cc.Material;
      MotionStreak = _cc.MotionStreak;
      murmurhash2_32_gc = _cc.murmurhash2_32_gc;
      renderer = _cc.renderer;
      resources = _cc.resources;
      Root = _cc.Root;
      Sprite = _cc.Sprite;
      StencilManager = _cc.StencilManager;
      Texture2D = _cc.Texture2D;
      TiledLayer = _cc.TiledLayer;
    }, function (_ccEnv) {
      DEBUG = _ccEnv.DEBUG;
      EDITOR = _ccEnv.EDITOR;
      JSB = _ccEnv.JSB;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bd7e7vtojdMUJODlbuIb/Yi", "MultTextures", undefined); //*//


      __checkObsolete__(['__private', 'approx', 'assert', 'BaseRenderData', 'BitmapFont', 'cclegacy', 'Component', 'Director', 'director', 'EPSILON', 'Game', 'game', 'gfx', 'ImageAsset', 'Label', 'Material', 'MeshBuffer', 'MotionStreak', 'murmurhash2_32_gc', 'Node', 'renderer', 'resources', 'Root', 'Sprite', 'SpriteFrame', 'StencilManager', 'Texture2D', 'TiledLayer', 'TiledRenderData', 'UIMeshRenderer', 'UIRenderer']);

      VER = "2.0.2"; //最大纹理,固定8张

      MAX_TEX = 8; //原生开关,根据需要开启或关闭

      SUPPORT_NATIVE = true; //@ts-ignore

      gfx.Texture.prototype.texID = -1; //当前纹理id
      //@ts-ignore

      Material.prototype.isMult = false; //多纹理材质的标记
      //@ts-ignore

      Component.prototype.useMult = false; //组件多纹理开关

      _export("MultBatch2D", MultBatch2D = {
        native: !SUPPORT_NATIVE && JSB,
        enable: false,
        parent: null,
        incID: 0,
        count: 0,
        hash: 0,
        reset: function reset() {
          this.incID += this.count;
          this.count = 0;
        }
      });

      _image = new ImageAsset({
        width: 1,
        height: 1,
        _compressed: false,
        format: gfx.Format.RGBA32F,
        _data: new Float32Array(4).fill(0)
      });
      Texture = new Texture2D();
      Texture.setFilters(1, 1);
      Texture.image = _image;
      Texture.addRef(); //预加载多纹理材质

      loadMultTextures = function loadMultTextures() {
        MultBatch2D.enable = false;
        resources.load("multTextures/Mult-material", Material, (err, material) => {
          if (!err) {
            var mat = cclegacy.builtinResMgr.get('ui-sprite-material');

            if (mat) {
              mat._hash = MultBatch2D.hash = Material.getHash(mat);
              MultBatch2D.parent = material;
              MultBatch2D.enable = true;
              material.addRef();
            }
          }
        });
      }; //填补原生纹理数据


      endBatcher = function endBatcher() {
        var _director$root;

        if (!JSB) return;
        var batcher = (_director$root = director.root) == null ? void 0 : _director$root.batcher2D;

        if (batcher && batcher.isMult) {
          var mat = batcher._currMaterial;

          if (mat && MultBatch2D.count > 0) {
            var tid = Texture.getGFXTexture(); //?.objectID;

            var cache = batcher.cacheTextures;

            for (var i = MultBatch2D.count; i < 8; i++) {
              if (cache[i] !== tid) {
                mat.setProperty("texture" + i, Texture);
                cache[i] = tid;
              }
            }
          }
        }
      }; //多纹理材质缓存队列


      _cacheUseCount = 0;
      _cacheMaterials = [];

      getMultMaterial = function getMultMaterial(oldMat, rd) {
        if (rd === void 0) {
          rd = null;
        }

        var MB = MultBatch2D;
        endBatcher();
        MB.reset();

        if (!MB.enable || !oldMat || !rd || !rd.isMult) {
          return oldMat;
        }

        if (!MB.parent || !MB.parent.isValid) {
          loadMultTextures();
          return oldMat;
        }

        var newMat = _cacheMaterials[_cacheUseCount++];

        if (!newMat || !newMat.isValid) {
          var material = {
            parent: MB.parent
          };
          newMat = new renderer.MaterialInstance(material);
          _cacheMaterials[_cacheUseCount - 1] = newMat;
          newMat['cacheTextures'] = [];
          newMat['isMult'] = true;
          newMat.addRef();
        }

        return newMat;
      }; //游戏启动前，务必加载多纹理材质


      game.once(Game.EVENT_GAME_INITED, () => {
        if (EDITOR || MultBatch2D.native) return; //|| JSB

        loadMultTextures();
      }); ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // 多纹理合批，sprite , label , renderdata ，等其他组件的重写和监听
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      inject_Renderdata = function inject_Renderdata() {
        var RenderData = cclegacy.UI.RenderData.prototype;
        RenderData.texID = -1;
        RenderData.isMult = false;
        RenderData.matDirty = true;
        RenderData.texDirty = true;
        RenderData.dataDirty = 0x0; //兼容多纹理hash计算

        RenderData.updateHash = function () {
          if (this.isMult && MultBatch2D.enable) {
            var bid = this.chunk ? this.chunk.bufferId : -1;
            var hashString = "" + bid + this.layer + '98k';
            this.dataHash = murmurhash2_32_gc(hashString, 666);
            this.hashDirty = false;
          } else {
            var _bid = this.chunk ? this.chunk.bufferId : -1;

            var _hashString = "" + _bid + this.layer + " " + this.textureHash;

            this.dataHash = murmurhash2_32_gc(_hashString, 666);
            this.hashDirty = false;
          }

          this.matDirty = false;
        }; //监听纹理的变更


        Object.defineProperty(RenderData, "textureDirty", {
          get: function get() {
            return this.texDirty;
          },
          set: function set(val) {
            this.texDirty = val;

            if (val === true) {
              this.texID = -1;
            }
          }
        }); //检测是否支持多纹理合批

        var isMultTextures = function isMultTextures(rd, uir) {
          rd.isMult = false;
          var material = uir.getRenderMaterial(0);
          if (!material || !MultBatch2D.enable) return; //@ts-ignore
          //组件控制开关 useMult: 可以开启自定义组件参与多纹理
          //|| uir instanceof Sprite || uir instanceof Label

          if (uir.useMult) {
            material._hash = material.hash || material._hash;

            if (!material._hash) {
              material._hash = Material.getHash(material);
            }

            rd.isMult = MultBatch2D.hash == material._hash;
          }
        }; //监听pass变更，检测是否多纹理支持


        var updatePass = RenderData.updatePass;

        RenderData.updatePass = function (comp) {
          isMultTextures(this, comp);
          updatePass.call(this, comp);
        }; //监听pass变更，检测是否多纹理支持


        var updateRenderData = RenderData.updateRenderData;

        RenderData.updateRenderData = function (comp, frame) {
          if (this.passDirty) {
            isMultTextures(this, comp);
          } //isMultTextures(this, comp);


          updateRenderData.call(this, comp, frame);
        };
      };

      inject_Label = function inject_Label() {
        //@ts-ignore
        Label.prototype.useMult = true; //监听 Label 的 uv 变更

        var label = Label.Assembler;

        if (label) {
          var getAssembler = label.getAssembler;

          label.getAssembler = function (comp) {
            var assembler = getAssembler.call(this, comp);

            if (assembler.changeUV == undefined) {
              assembler.changeUV = function (s) {
                var rd = s.renderData;
                rd && (rd.dataDirty = 1);
              };

              var UVs = assembler.updateUVs;

              if (UVs) {
                if (comp.font instanceof BitmapFont) {
                  assembler.updateUVs = function (comp) {
                    UVs.call(this, comp);
                    this.changeUV(comp);
                  };
                } else if (comp.cacheMode === Label.CacheMode.CHAR) {
                  assembler.updateUVs = function (comp) {
                    UVs.call(this, comp);
                    this.changeUV(comp);
                  };
                } else {
                  assembler.updateUVs = function (comp) {
                    UVs.call(this, comp);
                    var renderData = comp.renderData;

                    if (!renderData || !comp.ttfSpriteFrame) {
                      return;
                    }

                    this.changeUV(comp);
                  };
                }
              }
            }

            return assembler;
          };
        }
      };

      inject_Sprite = function inject_Sprite() {
        //@ts-ignore
        Sprite.prototype.useMult = true; //监听 sprite 的 uv 变更

        var sprite = Sprite.Assembler;

        if (sprite) {
          var getAssembler = sprite.getAssembler;

          sprite.getAssembler = function (comp) {
            var assembler = getAssembler.call(this, comp);

            if (assembler.changeUV == undefined) {
              assembler.changeUV = function (s) {
                var rd = s.renderData;
                rd && (rd.dataDirty = 1);
              };

              var UVs = assembler.updateUVs;

              if (UVs) {
                if (comp.type == Sprite.Type.FILLED) {
                  if (comp.fillType != Sprite.FillType.RADIAL) {
                    assembler.updateUVs = function (s, f0, f1) {
                      UVs.call(this, s, f0, f1);
                      this.changeUV(s);
                    };
                  }
                } else {
                  if (comp.type != Sprite.Type.TILED) {
                    assembler.updateUVs = function (s) {
                      UVs.call(this, s);
                      if (s.spriteFrame) this.changeUV(s);
                    };
                  }
                }
              }

              if (JSB) {
                var wUV = assembler.updateWorldUVData;

                if (wUV) {
                  assembler.updateWorldUVData = function (s) {
                    wUV.call(this, s);
                    this.changeUV(s);
                  };
                }
              }

              var verUV = assembler.updateWorldVertexAndUVData;

              if (verUV) {
                assembler.updateWorldVertexAndUVData = function (s, c) {
                  verUV.call(this, s, c);
                  this.changeUV(s);
                };
              }
            }

            return assembler;
          };
        }
      };

      inject_MotionStreak = function inject_MotionStreak() {
        if (MotionStreak) {
          var motionStreak = MotionStreak.prototype;
          motionStreak.useMult = true; //参与多纹理合批

          var lateUpdate = motionStreak.lateUpdate;

          motionStreak.lateUpdate = function (dt) {
            lateUpdate.call(this, dt);

            if (this._assembler) {
              if (this.points.length >= 2) {
                var rd = this.renderData; //全局标记刷新纹理uv

                rd && (rd.dataDirty = 1);
              }
            }
          };
        }
      };

      inject_TiledLayer = function inject_TiledLayer() {
        if (TiledLayer && !JSB) {
          var Tiled = TiledLayer.prototype;
          ;
          Tiled.useMult = true; //参与多纹理合批

          Tiled.dataDirty = false; //全局标记刷新纹理uv

          var setUserNodeDirty = Tiled.setUserNodeDirty;

          Tiled.setUserNodeDirty = function (dirty) {
            setUserNodeDirty.call(this, dirty);

            if (!dirty) {
              //全局标记刷新纹理uv
              this.dataDirty = true;
            }
          };

          Tiled._render = function (ui) {
            var _this = this;

            var layer = this.node.layer;

            var _loop = function _loop(_j) {
              _this._tiledDataArrayIdx = i;
              var m = _this._tiledDataArray[i];
              var info = _this._drawInfoList[_j];

              if (m.subNodes) {
                // 提前处理 User Nodes
                m.subNodes.forEach(c => {
                  if (c) {
                    ui.walk(c.node);
                    _j++;
                  }
                });
              } else {
                var td = m;

                if (td.texture) {
                  var isDirty = false;
                  var rd = td.renderData;
                  rd.material = _this.getRenderMaterial(0);

                  if (rd.texture !== td.texture) {
                    rd.texture = td.texture; // isDirty = true;
                  }

                  if (rd.layer !== layer) {
                    rd.layer = layer;
                    isDirty = true;
                  }

                  rd.isMult = true; //强制参与多纹理
                  // if (JSB) rd._renderDrawInfo = info;
                  //更新renderdata hash

                  isDirty && rd.updateHash();
                  if (_this.dataDirty) rd.dataDirty = 1; // NOTE: 由于 commitComp 只支持单张纹理, 故分多次提交

                  ui.commitComp(_this, td.renderData, td.texture, _this._assembler, null);
                  _j++;
                }
              }

              j = _j;
            };

            for (var i = 0, j = 0; i < this._tiledDataArray.length; i++) {
              _loop(j);
            }

            this.dataDirty = false;
            this.node._static = true;
          };
        }
      };

      game.once(Game.EVENT_ENGINE_INITED, () => {
        if (EDITOR || MultBatch2D.native) return; //|| JSB

        inject_Label();
        inject_Sprite();
        inject_Renderdata();
        inject_TiledLayer();
        inject_MotionStreak();
        director.on(Director.EVENT_AFTER_DRAW, dt => {
          MultBatch2D.reset();
          _cacheUseCount = 0;
        }); ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 多纹理合批，合批核心过程修改
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var Batcher2D = cclegacy.internal.Batcher2D.prototype;
        Batcher2D.isMult = false; //多纹理标记

        Batcher2D.isNative = JSB; //原生的开关

        Batcher2D.cacheTextures = []; //纹理缓存数据

        Batcher2D.currMaterial = null; //当前指定材质

        Object.defineProperty(Batcher2D, "_currMaterial", {
          get: function get() {
            return this.currMaterial;
          },
          set: function set(material) {
            // if (this.currMaterial === material) return;
            //检测多纹理材质，接替 _currMaterial
            var rd = this._currRenderData; //重置检测

            if (material == this._emptyMaterial) rd = null;
            this.currMaterial = getMultMaterial(material, rd);
            this.isMult = false;

            if (MultBatch2D.enable) {
              if (this.currMaterial && this.currMaterial.isMult) {
                this.cacheTextures = this.currMaterial.cacheTextures;
                this.isMult = true; //当前 batcher 多纹理标记
              }
            }
          }
        });
        var Stage_ENTER_LEVEL = 2;
        var Stage_ENTER_LEVEL_INVERTED = 6; //@ts-ignore

        Batcher2D.commitComp = function (comp, renderData, frame, assembler, transform) {
          var dataHash = 0;
          var mat = null;
          var bufferID = -1;

          if (renderData && renderData.chunk) {
            if (!renderData.isValid()) return;
            dataHash = renderData.dataHash;
            mat = renderData.material;
            bufferID = renderData.chunk.bufferId;
          } // Notice: A little hack, if it is for mask, not need update here, while control by stencilManger


          if (comp.stencilStage === Stage_ENTER_LEVEL || comp.stencilStage === Stage_ENTER_LEVEL_INVERTED) {
            this._insertMaskBatch(comp);
          } else {
            comp.stencilStage = StencilManager.sharedManager.stage;
          }

          var depthStencilStateStage = comp.stencilStage;
          var texID = -1;
          var texture = null;
          var MB = MultBatch2D;
          var flushBatch = false;
          var isNative = this.isNative; //@ts-ignore

          if (MB.enable && renderData && renderData.isMult) {
            if (frame && frame.isValid) texture = frame.getGFXTexture();

            if (texture) {
              //@ts-ignore
              if (texture.texID === undefined) texture.texID = -1; //@ts-ignore

              texID = texture.texID - MB.incID;
              flushBatch = texID < 0 && MB.count >= MAX_TEX;
              if (this.isMult) mat = this._currMaterial;
            }
          }

          if (flushBatch || this._currHash !== dataHash || dataHash === 0 || this._currMaterial !== mat || this._currDepthStencilStateStage !== depthStencilStateStage) {
            // Merge all previous data to a render batch, and update buffer for next render data
            this.autoMergeBatches(this._currComponent);

            if (!isNative && renderData && !renderData._isMeshBuffer) {
              this.updateBuffer(renderData.vertexFormat, bufferID);
            }

            this._currRenderData = renderData;
            this._currHash = renderData ? renderData.dataHash : 0;
            this._currComponent = comp;
            this._currTransform = transform;
            this._currMaterial = comp.getRenderMaterial(0);
            this._currDepthStencilStateStage = depthStencilStateStage;
            this._currLayer = comp.node.layer;

            if (frame) {
              if (DEBUG) {
                assert(frame.isValid, 'frame should not be invalid, it may have been released');
              }

              this._currTexture = frame.getGFXTexture();
              this._currSampler = frame.getGFXSampler();
              this._currTextureHash = frame.getHash();
              this._currSamplerHash = this._currSampler.hash;
            } else {
              this._currTexture = null;
              this._currSampler = null;
              this._currTextureHash = 0;
              this._currSamplerHash = 0;
            }
          }

          if (!isNative) assembler.fillBuffers(comp, this);

          if (texture) {
            if (texID < 0 || MB.count === 0) {
              texID = MB.count++; //@ts-ignore
              //let id = texture.objectID;
              //@ts-ignore

              texture.texID = texID + MB.incID;
              var caches = this.cacheTextures;

              if (caches[texID] !== texture) {
                caches[texID] = texture; //@ts-ignore

                texture = frame.texture;
                if (!texture) texture = frame;

                this._currMaterial.setProperty("texture" + texID, texture);
              }
            }

            this.fillTextureID(renderData, texID);

            if (isNative) {
              renderData.renderDrawInfo.setMaterial(this._currMaterial);
            }
          }
        }; //填充多纹理 id 到顶点数据


        Batcher2D.fillTextureID = function (renderData, texID) {
          // if (!renderData) return;
          var vbuf = renderData.chunk.vb;
          var uvX = 0,
              length = vbuf.length;

          if (renderData.dataDirty === 1) {
            for (var i = 0; i < length; i += 9) {
              uvX = ~~(vbuf[i + 3] * 100000);
              vbuf[i + 3] = uvX * 10 + texID;
            }
          } else {
            if (renderData.texID !== texID) {
              for (var _i = 0; _i < length; _i += 9) {
                uvX = ~~(vbuf[_i + 3] * 0.1);
                vbuf[_i + 3] = uvX * 10 + texID;
              }
            }
          }

          renderData.dataDirty = 0;
          renderData.texID = texID;
        }; ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 多纹理合批，原生平台支持的修改
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        if (!EDITOR && JSB) {
          var rootProto = Root.prototype;
          var oldFrameMove = rootProto.frameMove;

          rootProto.frameMove = function (deltaTime) {
            var _director$root2;

            //@ts-ignore
            (_director$root2 = director.root) == null || _director$root2.batcher2D.update(); //director.root?.batcher2D.reset();

            oldFrameMove.call(this, deltaTime, director.getTotalFrames());
          };

          Batcher2D.update = function update() {
            var screens = this._screens;

            for (var i = 0; i < screens.length; ++i) {
              var screen = screens[i];

              var scene = screen._getRenderScene();

              if (!screen.enabledInHierarchy || !scene) {
                continue;
              } // Reset state and walk


              this._opacityDirty = 0;
              this._pOpacity = 1;
              this._batchRootDepth = 0;
              this.walk(screen.node);
              this.resetRenderStates();
            }

            this._batches.clear();

            this.resetRenderStates();
            StencilManager.sharedManager.reset();
          };

          Batcher2D.walk = function walk(node, level) {
            if (level === void 0) {
              level = 0;
            }

            if (!node.activeInHierarchy) {
              return;
            }

            var children = node.children;
            var uiProps = node._uiProps;
            var render = uiProps.uiComp; // Save opacity

            var parentOpacity = this._pOpacity;
            var opacity = parentOpacity; // TODO Always cascade ui property's local opacity before remove it

            var selfOpacity = render && render.color ? render.color.a / 255 : 1;
            this._pOpacity = opacity *= selfOpacity * uiProps.localOpacity; // TODO Set opacity to ui property's opacity before remove it
            //@ts-ignore
            //uiProps.setOpacity(opacity);

            uiProps._opacity = opacity;

            if (!approx(opacity, 0, EPSILON)) {
              // Render assembler update logic
              if (render && render.enabledInHierarchy) {
                render.fillBuffers(this); // for rendering
              }

              if (children.length > 0 && !node._static) {
                for (var i = 0; i < children.length; ++i) {
                  var child = children[i];
                  this.walk(child, level);
                }
              }
            } // Restore opacity


            this._pOpacity = parentOpacity; // Post render assembler update logic
            // ATTENTION: Will also reset colorDirty inside postUpdateAssembler

            if (render && render.enabledInHierarchy) {
              render.postUpdateAssembler(this);

              if ((render.stencilStage === Stage_ENTER_LEVEL || render.stencilStage === Stage_ENTER_LEVEL_INVERTED) && StencilManager.sharedManager.getMaskStackSize() > 0) {
                this.autoMergeBatches(this._currComponent);
                this.resetRenderStates();
                StencilManager.sharedManager.exitMask();
              }
            }

            level += 1;
          };

          Batcher2D._insertMaskBatch = function (comp) {
            this.autoMergeBatches(this._currComponent);
            this.resetRenderStates(); //this._createClearModel();
            //this._maskClearModel!.node = this._maskClearModel!.transform = comp.node;

            var _stencilManager = StencilManager.sharedManager;

            _stencilManager.pushMask(1); //not need object，only use length
            //_stencilManager.clear(comp); //invert


            _stencilManager.enableMask();
          };

          Batcher2D.commitModel = function (comp, model, mat) {
            // if the last comp is spriteComp, previous comps should be batched.
            if (this._currMaterial !== this._emptyMaterial) {
              this.autoMergeBatches(this._currComponent);
              this.resetRenderStates();
            }

            if (mat) {
              // Notice: A little hack, if it is for mask, not need update here, while control by stencilManger
              if (comp.stencilStage === Stage_ENTER_LEVEL || comp.stencilStage === Stage_ENTER_LEVEL_INVERTED) {
                this._insertMaskBatch(comp);
              } else {
                //@ts-ignore
                comp._stencilStage = StencilManager.sharedManager.stage;
              }
            }
          };

          Batcher2D.commitIA = function (renderComp, ia, tex, mat, transform) {
            // if the last comp is spriteComp, previous comps should be batched.
            if (this._currMaterial !== this._emptyMaterial) {
              this.autoMergeBatches(this._currComponent);
              this.resetRenderStates();
            }

            if (renderComp) {
              //@ts-ignore
              renderComp._stencilStage = StencilManager.sharedManager.stage;
            }
          };

          Batcher2D.commitMiddleware = function (comp, meshBuffer, indexOffset, indexCount, tex, mat, enableBatch) {
            this.autoMergeBatches(this._currComponent);
            this.resetRenderStates();
            this._currIsMiddleware = true;
          };

          Batcher2D.autoMergeBatches = function (renderComp) {
            if (this._currIsMiddleware) {
              // this.mergeBatchesForMiddleware(renderComp!);
              if (renderComp) {
                //@ts-ignore
                renderComp._stencilStage = StencilManager.sharedManager.stage;
              }

              this._currIsMiddleware = false;
              this._middlewareBuffer = null;
            }
          }; // if (Graphics) {
          //     const graphics: any = Graphics.prototype;
          //     graphics.debugDraw = false;
          //     const _render = graphics._render;
          //     graphics._render = function (render: any): void {
          //         if (this.debugDraw) {
          //             this._isNeedUploadData = false;
          //         }
          //         _render.call(this, render);
          //     }
          // }
          // if (sp.Skeleton) {
          //     const Skeleton: any = sp.Skeleton.prototype;
          //     const _updateDebugDraw = Skeleton._updateDebugDraw;
          //     Skeleton._updateDebugDraw = function () {
          //         _updateDebugDraw.call(this);
          //         if (this._debugRenderer) {
          //             this._debugRenderer.debugDraw = true;
          //         }
          //     }
          // }

        }
      }); //*/

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=bca50dd9ee81a379507b23fc942a52a699613b10.js.map