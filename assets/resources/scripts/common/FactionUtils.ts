import { Node, warn } from "cc";
import { CharacterStats } from "../characters/components/CharacterStats"; // 注意相对路径
import { Faction } from "./Enums";

/**
 * 提供阵营关系判断的静态工具方法。
 */
export class FactionUtils {

    /**
     * 获取节点上的阵营信息。
     * @param unit 节点
     * @returns 节点的阵营，如果找不到 CharacterStats 或节点无效则返回 null
     */
    private static getFaction(unit: Node | null): Faction | null {
        if (!unit || !unit.isValid) {
            return null;
        }
        const stats = unit.getComponent(CharacterStats);
        if (!stats) {
            // warn(`[FactionUtils] 节点 "${unit.name}" 上找不到 CharacterStats 组件。`);
            return null;
        }
        return stats.faction;
    }

    /**
     * 判断 unitB 是否是 unitA 的敌人。
     * 当前规则 (PvE): PLAYER 视 ENEMY 为敌人，ENEMY 视 PLAYER 为敌人。
     * @param unitA 第一个单位节点
     * @param unitB 第二个单位节点
     * @returns 如果是敌人关系，返回 true；否则返回 false。
     */
    public static isEnemy(unitA: Node | null, unitB: Node | null): boolean {
        const factionA = FactionUtils.getFaction(unitA);
        const factionB = FactionUtils.getFaction(unitB);

        if (factionA === null || factionB === null || factionA === factionB) {
            return false; // 无效阵营或相同阵营不是敌人
        }

        // PvE 规则: 玩家和敌人互为敌对
        if ((factionA === Faction.PLAYER && factionB === Faction.ENEMY) ||
            (factionA === Faction.ENEMY && factionB === Faction.PLAYER)) {
            return true;
        }

        // TODO: 未来扩展 PvP 或其他阵营关系可以在这里添加逻辑

        return false; // 其他情况（如同为 PLAYER，或涉及 NEUTRAL）均不视为敌人
    }

    /**
     * 判断 unitB 是否是 unitA 的友方。
     * 当前规则 (PvE): PLAYER 视其他 PLAYER 为友方。
     * 注意：此实现不认为自己是自己的友方。如果需要包含自己，请调整逻辑。
     * @param unitA 第一个单位节点
     * @param unitB 第二个单位节点
     * @returns 如果是友方关系（且不是同一单位），返回 true；否则返回 false。
     */
    public static isAlly(unitA: Node | null, unitB: Node | null): boolean {
        if (!unitA || !unitB || unitA === unitB) {
            return false; // 无效节点或同一节点不是友方
        }

        const factionA = FactionUtils.getFaction(unitA);
        const factionB = FactionUtils.getFaction(unitB);

        if (factionA === null || factionB === null) {
            return false; // 无效阵营无法判断
        }

        // PvE 规则: 玩家之间互为友方
        if (factionA === Faction.PLAYER && factionB === Faction.PLAYER) {
            return true;
        }

        // TODO: 未来扩展 PvP 或其他阵营关系可以在这里添加逻辑

        return false; // 其他情况（如 ENEMY 阵营内部，或涉及 NEUTRAL）均不视为友方
    }
} 