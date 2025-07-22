import { TeamMemberships } from "@/types/entities";
import { TeamMemberFormPayload } from "./EditProjectTeamMembersModal";


export function isTeamDirty(
    original: TeamMemberships[],
    current: TeamMemberFormPayload[]
): boolean {
    // 1) Any brand-new row?
    if (current.some((m) => m.is_new)) {
        return true;
    }

    // 2) Any row marked for deletion?
    if (current.some((m) => m.is_deleted)) {
        return true;
    }

    // build a lookup of the originals by user_id
    const origById = Object.fromEntries(
        original.map((o) => [o.user_id, o])
    );

    // 3) Any existing row whose is_project_manager flag has changed?
    for (const m of current) {
        // skip brand-new rows (we already handled them)  
        if (m.is_new) continue;

        const orig = origById[m.user_data.id];
        // if it wasn’t in the original at all, that’s “dirty” too
        if (!orig) {
            return true;
        }

        if (orig.is_project_manager !== m.is_project_manager) {
            return true;
        }
    }

    // 4) Any original row missing entirely from current?  
    //    (i.e. deleted but not even flagged is_deleted)
    const currIds = new Set(current.map((m) => m.user_data.id));
    if (original.some((o) => !currIds.has(o.user_id))) {
        return true;
    }

    // if we got here, nothing’s changed
    return false;
}
