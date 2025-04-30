System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Color, Mat4, dynamicAtlasManager, lerp, LabelAnimRuntimeInfo, PopUpLabelAssembler, _crd, m, popUpLabelAssembler;

  function _reportPossibleCrUseOfLabelAnimRuntimeInfo(extras) {
    _reporterNs.report("LabelAnimRuntimeInfo", "./label-anim-runtime-data", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPopUpLabel(extras) {
    _reporterNs.report("PopUpLabel", "./popup-label", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Color = _cc.Color;
      Mat4 = _cc.Mat4;
      dynamicAtlasManager = _cc.dynamicAtlasManager;
      lerp = _cc.lerp;
    }, function (_unresolved_2) {
      LabelAnimRuntimeInfo = _unresolved_2.LabelAnimRuntimeInfo;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6cb5ajeKdVIZo6nO/F6sPZt", "popup-label-assembler", undefined);

      __checkObsolete__(['Color', 'IAssembler', 'Mat4', 'dynamicAtlasManager', 'lerp']);

      m = new Mat4();
      PopUpLabelAssembler = class PopUpLabelAssembler {
        createData(comp) {
          var renderData = comp.requestRenderData();
          return renderData;
        }

        updateRenderData(comp) {
          var frame = comp.spriteFrame;
          dynamicAtlasManager.packToDynamicAtlas(comp, frame);
          var renderData = comp.renderData;

          if (renderData && frame) {
            if (renderData.vertDirty) {
              this.updateVertexData(comp);
            }

            this.updateUVs(comp);
            this.updateColor(comp);
            renderData.updateRenderData(comp, frame);
          }
        }

        fillBuffers(comp, renderer) {
          var renderData = comp.renderData;
          var chunk = renderData.chunk;
          var vData = chunk.vb;
          var dataList = renderData.data;
          var node = comp.node;
          var stride = renderData.floatStride;
          var length = dataList.length;
          node.getWorldMatrix(m);
          var vertexOffset = 0;

          for (var i = 0; i < length; i++) {
            var vert = dataList[i];
            var x = vert.x;
            var y = vert.y;
            var rhw = m.m03 * x + m.m07 * y + m.m15;
            rhw = rhw ? 1 / rhw : 1;
            vertexOffset = i * stride;
            vData[vertexOffset + 0] = (m.m00 * x + m.m04 * y + m.m12) * rhw;
            vData[vertexOffset + 1] = (m.m01 * x + m.m05 * y + m.m13) * rhw;
            vData[vertexOffset + 2] = (m.m02 * x + m.m06 * y + m.m14) * rhw;
            vData[vertexOffset + 3] = vert.u;
            vData[vertexOffset + 4] = vert.v;
            Color.toArray(vData, vert.color, vertexOffset + 5);
          }

          var vidOrigin = chunk.vertexOffset;
          var meshBuffer = chunk.meshBuffer;
          var ib = chunk.meshBuffer.iData;
          var indexOffset = meshBuffer.indexOffset;

          for (var v = 0; v < length / 4; v++) {
            var vid = vidOrigin + v * 4;
            ib[indexOffset++] = vid + 0;
            ib[indexOffset++] = vid + 1;
            ib[indexOffset++] = vid + 2;
            ib[indexOffset++] = vid + 0;
            ib[indexOffset++] = vid + 2;
            ib[indexOffset++] = vid + 3;
            meshBuffer.indexOffset += 6;
          }
        }
        /**
         * font text / uv cord:
         * 
         * 0 — x
         * |
         * y
         * 
         * ui cord:
         * 
         *       y
         *       |
         * -x — 0 — x
         *       |
         *      -y
         */


        updateVertexData(comp) {
          var renderData = comp.renderData;
          var vertexCount = comp.anims.reduce((pre, current) => {
            return pre + current.data.text.length;
          }, 0) * 4;
          var indexCount = vertexCount * 3 / 2;
          renderData.clear();
          renderData.dataLength = vertexCount;
          renderData.resize(vertexCount, indexCount);
          var letterCount = 0;
          comp.anims.forEach(anim => {
            var scale = anim.current.scale;
            var baseX = anim.current.position.x;
            var baseY = anim.current.position.y;

            for (var letterIndex = 0; letterIndex < anim.len; letterIndex++, letterCount++) {
              var x = scale * anim.layout[letterIndex * (_crd && LabelAnimRuntimeInfo === void 0 ? (_reportPossibleCrUseOfLabelAnimRuntimeInfo({
                error: Error()
              }), LabelAnimRuntimeInfo) : LabelAnimRuntimeInfo).LetterOffset + 0];
              var y = scale * anim.layout[letterIndex * (_crd && LabelAnimRuntimeInfo === void 0 ? (_reportPossibleCrUseOfLabelAnimRuntimeInfo({
                error: Error()
              }), LabelAnimRuntimeInfo) : LabelAnimRuntimeInfo).LetterOffset + 1];
              var w = scale * anim.layout[letterIndex * (_crd && LabelAnimRuntimeInfo === void 0 ? (_reportPossibleCrUseOfLabelAnimRuntimeInfo({
                error: Error()
              }), LabelAnimRuntimeInfo) : LabelAnimRuntimeInfo).LetterOffset + 2];
              var h = scale * anim.layout[letterIndex * (_crd && LabelAnimRuntimeInfo === void 0 ? (_reportPossibleCrUseOfLabelAnimRuntimeInfo({
                error: Error()
              }), LabelAnimRuntimeInfo) : LabelAnimRuntimeInfo).LetterOffset + 3];
              var offsetx = scale * anim.layout[letterIndex * (_crd && LabelAnimRuntimeInfo === void 0 ? (_reportPossibleCrUseOfLabelAnimRuntimeInfo({
                error: Error()
              }), LabelAnimRuntimeInfo) : LabelAnimRuntimeInfo).LetterOffset + 4];
              var offsety = scale * anim.layout[letterIndex * (_crd && LabelAnimRuntimeInfo === void 0 ? (_reportPossibleCrUseOfLabelAnimRuntimeInfo({
                error: Error()
              }), LabelAnimRuntimeInfo) : LabelAnimRuntimeInfo).LetterOffset + 5];
              renderData.data[letterCount * 4 + 0].x = baseX + offsetx;
              renderData.data[letterCount * 4 + 0].y = baseY - (offsety + h);
              renderData.data[letterCount * 4 + 1].x = baseX + offsetx + w;
              renderData.data[letterCount * 4 + 1].y = baseY - (offsety + h);
              renderData.data[letterCount * 4 + 2].x = baseX + offsetx + w;
              renderData.data[letterCount * 4 + 2].y = baseY - offsety;
              renderData.data[letterCount * 4 + 3].x = baseX + offsetx;
              renderData.data[letterCount * 4 + 3].y = baseY - offsety;
            }
          });
          renderData.vertDirty = false;
        }

        updateUVs(comp) {
          var renderData = comp.renderData;

          if (!renderData.data.length) {
            return;
          } //@ts-ignore


          renderData.dataDirty = 1;
          /** 01  11  00  10 */

          var uv = comp.spriteFrame.uv;
          var uv_l = uv[0];
          var uv_r = uv[2];
          var uv_b = uv[1];
          var uv_t = uv[5];
          var tw = comp.spriteFrame.originalSize.width;
          var th = comp.spriteFrame.originalSize.height;
          var letterCount = 0;
          comp.anims.forEach(anim => {
            for (var letterIndex = 0; letterIndex < anim.len; letterIndex++, letterCount++) {
              var x = anim.layout[letterIndex * (_crd && LabelAnimRuntimeInfo === void 0 ? (_reportPossibleCrUseOfLabelAnimRuntimeInfo({
                error: Error()
              }), LabelAnimRuntimeInfo) : LabelAnimRuntimeInfo).LetterOffset + 0];
              var y = anim.layout[letterIndex * (_crd && LabelAnimRuntimeInfo === void 0 ? (_reportPossibleCrUseOfLabelAnimRuntimeInfo({
                error: Error()
              }), LabelAnimRuntimeInfo) : LabelAnimRuntimeInfo).LetterOffset + 1];
              var w = anim.layout[letterIndex * (_crd && LabelAnimRuntimeInfo === void 0 ? (_reportPossibleCrUseOfLabelAnimRuntimeInfo({
                error: Error()
              }), LabelAnimRuntimeInfo) : LabelAnimRuntimeInfo).LetterOffset + 2];
              var h = anim.layout[letterIndex * (_crd && LabelAnimRuntimeInfo === void 0 ? (_reportPossibleCrUseOfLabelAnimRuntimeInfo({
                error: Error()
              }), LabelAnimRuntimeInfo) : LabelAnimRuntimeInfo).LetterOffset + 3];
              var d0 = renderData.data[letterCount * 4 + 0];
              var d1 = renderData.data[letterCount * 4 + 1];
              var d2 = renderData.data[letterCount * 4 + 2];
              var d3 = renderData.data[letterCount * 4 + 3];
              d0.u = lerp(uv_l, uv_r, x / tw);
              d0.v = lerp(uv_t, uv_b, (y + h) / th);
              d1.u = lerp(uv_l, uv_r, (x + w) / tw);
              d1.v = lerp(uv_t, uv_b, (y + h) / th);
              d2.u = lerp(uv_l, uv_r, (x + w) / tw);
              d2.v = lerp(uv_t, uv_b, y / th);
              d3.u = lerp(uv_l, uv_r, x / tw);
              d3.v = lerp(uv_t, uv_b, y / th);
            }
          });
        }

        updateColor(comp) {
          var renderData = comp.renderData;

          if (!renderData.data.length) {
            return;
          }

          var letterCount = 0;
          comp.anims.forEach(anim => {
            var color = anim.current.color;

            for (var letterIndex = 0; letterIndex < anim.len; letterIndex++, letterCount++) {
              renderData.data[letterCount * 4 + 0].color.set(color);
              renderData.data[letterCount * 4 + 1].color.set(color);
              renderData.data[letterCount * 4 + 2].color.set(color);
              renderData.data[letterCount * 4 + 3].color.set(color);
            }
          });
        }

      };

      _export("popUpLabelAssembler", popUpLabelAssembler = new PopUpLabelAssembler());

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=956931ce8b1b60d96746bc8784376911e37e59a6.js.map