import { Color, IAssembler, Mat4, dynamicAtlasManager, lerp } from "cc";
import { LabelAnimRuntimeInfo } from "./label-anim-runtime-data";
import { PopUpLabel } from "./popup-label";

const m = new Mat4();

class PopUpLabelAssembler implements IAssembler {
    createData(comp: PopUpLabel) {
        const renderData = comp.requestRenderData();
        return renderData;
    }

    updateRenderData(comp: PopUpLabel) {
        const frame = comp.spriteFrame;
        dynamicAtlasManager.packToDynamicAtlas(comp, frame);
        const renderData = comp.renderData;
        if (renderData && frame) {
            if (renderData.vertDirty) {
                this.updateVertexData(comp);
            }
            this.updateUVs(comp);
            this.updateColor(comp);
            renderData.updateRenderData(comp, frame);
        }
    }

    fillBuffers(comp: PopUpLabel, renderer: any) {
        const renderData = comp.renderData!;
        const chunk = renderData.chunk;
        const vData = chunk.vb;
        const dataList = renderData.data;
        const node = comp.node;
        const stride = renderData.floatStride;
        const length = dataList.length;

        node.getWorldMatrix(m);
        let vertexOffset = 0;
        for (let i = 0; i < length; i++) {
            const vert = dataList[i];
            const x = vert.x;
            const y = vert.y;
            let rhw = m.m03 * x + m.m07 * y + m.m15;
            rhw = rhw ? 1 / rhw : 1;

            vertexOffset = i * stride;
            vData[vertexOffset + 0] = (m.m00 * x + m.m04 * y + m.m12) * rhw;
            vData[vertexOffset + 1] = (m.m01 * x + m.m05 * y + m.m13) * rhw;
            vData[vertexOffset + 2] = (m.m02 * x + m.m06 * y + m.m14) * rhw;
            vData[vertexOffset + 3] = vert.u;
            vData[vertexOffset + 4] = vert.v;
            Color.toArray(vData, vert.color, vertexOffset + 5);
        }

        const vidOrigin = chunk.vertexOffset;
        const meshBuffer = chunk.meshBuffer;
        const ib = chunk.meshBuffer.iData;
        let indexOffset = meshBuffer.indexOffset;
        for (let v = 0; v < length / 4; v++) {
            const vid = vidOrigin + v * 4;
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
    updateVertexData(comp: PopUpLabel) {
        const renderData = comp.renderData;
        const vertexCount = comp.anims.reduce((pre, current) => {
            return pre + current.data.text.length;
        }, 0) * 4;
        const indexCount = vertexCount * 3 / 2;

        renderData.clear();
        renderData.dataLength = vertexCount;
        renderData.resize(vertexCount, indexCount);

        let letterCount = 0;
        comp.anims.forEach((anim) => {
            const scale = anim.current.scale;
            const baseX = anim.current.position.x;
            const baseY = anim.current.position.y;
            for (let letterIndex = 0; letterIndex < anim.len; letterIndex++, letterCount++) {
                const x = scale * anim.layout[letterIndex * LabelAnimRuntimeInfo.LetterOffset + 0];
                const y = scale * anim.layout[letterIndex * LabelAnimRuntimeInfo.LetterOffset + 1];
                const w = scale * anim.layout[letterIndex * LabelAnimRuntimeInfo.LetterOffset + 2];
                const h = scale * anim.layout[letterIndex * LabelAnimRuntimeInfo.LetterOffset + 3];
                const offsetx = scale * anim.layout[letterIndex * LabelAnimRuntimeInfo.LetterOffset + 4];
                const offsety = scale * anim.layout[letterIndex * LabelAnimRuntimeInfo.LetterOffset + 5];

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

    updateUVs(comp: PopUpLabel) {
        const renderData = comp.renderData;
        if (!renderData.data.length) {
            return;
        }
        //@ts-ignore
        renderData.dataDirty = 1;
        /** 01  11  00  10 */
        const uv = comp.spriteFrame.uv;
        const uv_l = uv[0];
        const uv_r = uv[2];
        const uv_b = uv[1];
        const uv_t = uv[5];
        const tw = comp.spriteFrame.originalSize.width;
        const th = comp.spriteFrame.originalSize.height;
        let letterCount = 0;
        comp.anims.forEach((anim) => {
            for (let letterIndex = 0; letterIndex < anim.len; letterIndex++, letterCount++) {
                const x = anim.layout[letterIndex * LabelAnimRuntimeInfo.LetterOffset + 0];
                const y = anim.layout[letterIndex * LabelAnimRuntimeInfo.LetterOffset + 1];
                const w = anim.layout[letterIndex * LabelAnimRuntimeInfo.LetterOffset + 2];
                const h = anim.layout[letterIndex * LabelAnimRuntimeInfo.LetterOffset + 3];

                const d0 = renderData.data[letterCount * 4 + 0];
                const d1 = renderData.data[letterCount * 4 + 1];
                const d2 = renderData.data[letterCount * 4 + 2];
                const d3 = renderData.data[letterCount * 4 + 3];

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

    updateColor(comp: PopUpLabel) {
        const renderData = comp.renderData;
        if (!renderData.data.length) {
            return;
        }
        let letterCount = 0;
        comp.anims.forEach((anim) => {
            const color = anim.current.color;
            for (let letterIndex = 0; letterIndex < anim.len; letterIndex++, letterCount++) {
                renderData.data[letterCount * 4 + 0].color.set(color);
                renderData.data[letterCount * 4 + 1].color.set(color);
                renderData.data[letterCount * 4 + 2].color.set(color);
                renderData.data[letterCount * 4 + 3].color.set(color);
            }
        });
    }
}

export const popUpLabelAssembler = new PopUpLabelAssembler();