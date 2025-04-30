import { _decorator, Component, UITransform } from 'cc';
import { LabelAnimData } from './popuplabel/label-anim-data';
import { ObjectPool } from './popuplabel/object-pool';
import { PopUpLabel } from './popuplabel/popup-label';
const { ccclass, property } = _decorator;

@ccclass('add_anim')
export class add_anim extends Component {
    @property(PopUpLabel)
    popup: PopUpLabel = null;

    update() {
        const width = this.node.getComponent(UITransform).contentSize.width;
        const height = this.node.getComponent(UITransform).contentSize.height;
        const x = ~~(width / 2 - width * Math.random());
        const y = ~~(height / 2 - height * Math.random());
        const anim = ObjectPool.allocate(LabelAnimData);
        anim.duration = 6;
        anim.ease = "backIn";
        anim.text = x + " ," + y;
        anim.from.scale = 0.3;
        anim.from.color.r = ~~(255 * Math.random());
        anim.from.color.g = ~~(255 * Math.random());
        anim.from.color.b = ~~(255 * Math.random());
        anim.from.position.x = x;
        anim.from.position.y = y;
        anim.to.scale = 0.2;
        anim.to.color.r = 255;
        anim.to.color.r = 255;
        anim.to.color.r = 255;
        anim.to.color.a = 0;
        this.popup.addAnim(anim);
        anim.release();
    }
}
