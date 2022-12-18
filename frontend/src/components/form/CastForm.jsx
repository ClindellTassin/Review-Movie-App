import { useState } from "react"
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import { renderItem, results } from "../admin/MovieForm";
import LiveSearch from "../LiveSearch";

const defaultCastInfo = {
    profile: {},
    roleAs: '',
    leadActor: false
}

export default function CastForm({ onSubmit }) {
    const { updateNotification } = useNotification();
    const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
    const { leadActor, profile, roleAs } = castInfo;

    const handleOnChange = ({ target }) => {
        const { checked, name, value } = target;

        if (name === 'leadActor') return setCastInfo({ ...castInfo, leadActor: checked });

        setCastInfo({ ...castInfo, [name]: value })
    }

    const handleProfileSelect = (profile) => {
        setCastInfo({ ...castInfo, profile });
    }

    const handleSubmit = () => {
        const { profile, roleAs } = castInfo;
        if (!profile.name) return updateNotification('error', 'Cast profile is missing')
        if (!roleAs.trim()) return updateNotification('error', 'Cast role is missing')

        onSubmit(castInfo);
        setCastInfo({ ...defaultCastInfo })
    }

    return (
        <div className="flex items-center space-x-2">
            <input type="checkbox" title="Set as lead actor" name="leadActor" onChange={handleOnChange} className="w-4 h-4" checked={leadActor} />
            <LiveSearch placeholder="Search Profile" value={profile.name} results={results} onSelect={handleProfileSelect} renderItem={renderItem} />
            <span className="dark:text-dark-subtle text-light-subtle font-semibold">as</span>
            <div className="flex-grow">
                <input type="text" value={roleAs} onChange={handleOnChange} name='roleAs' placeholder="Role as" className={commonInputClasses + " rounded p-1 text-lg border-2"} />
            </div>
            <button onClick={handleSubmit} type="button" className="bg-secondary dark:bg-white dark:text-primary text-white px-1 rounded">Add</button>
        </div>
    )
}
