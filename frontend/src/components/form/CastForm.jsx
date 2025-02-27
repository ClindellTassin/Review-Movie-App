import { useState } from "react"
import { useNotification, useSearch } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import { renderItem } from "../../utils/helper";
import LiveSearch from "../LiveSearch";
import { searchActor } from "../../api/actor";

const defaultCastInfo = {
    profile: {},
    roleAs: '',
    leadActor: false
}

export default function CastForm({ onSubmit }) {
    const { handleSearch, resetSearch } = useSearch();
    const { updateNotification } = useNotification();
    const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
    const [profiles, setProfiles] = useState([]);
    const { leadActor, profile, roleAs } = castInfo;

    const handleOnChange = ({ target }) => {
        const { checked, name, value } = target;

        if (name === 'leadActor') return setCastInfo({ ...castInfo, leadActor: checked });

        setCastInfo({ ...castInfo, [name]: value })
    }

    const handleProfileSelect = (profile) => {
        setCastInfo({ ...castInfo, profile });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { profile, roleAs } = castInfo;
        if (!profile.name) return updateNotification('error', 'Cast profile is missing')
        if (!roleAs.trim()) return updateNotification('error', 'Cast role is missing')

        onSubmit(castInfo);
        setCastInfo({ ...defaultCastInfo, profile: { name: "" } })
        resetSearch()
        setProfiles([])
    }

    const handleProfileChange = ({ target }) => {
        const { value } = target;
        const { profile } = castInfo;
        profile.name = value;
        setCastInfo({ ...castInfo, ...profile })
        handleSearch(searchActor, value, setProfiles)
    }

    return (
        <div className="flex items-center space-x-2">
            <input type="checkbox" title="Set as lead actor" name="leadActor" onChange={handleOnChange} className="w-4 h-4" checked={leadActor} />
            <LiveSearch placeholder="Search Profile" value={profile.name} results={profiles} onSelect={handleProfileSelect} renderItem={renderItem} onChange={handleProfileChange} />
            <span className="dark:text-dark-subtle text-light-subtle font-semibold">as</span>
            <div className="flex-grow">
                <input type="text" value={roleAs} onChange={handleOnChange} name='roleAs' placeholder="Role as" className={commonInputClasses + " rounded p-1 text-lg border-2"} />
            </div>
            <button onClick={handleSubmit} type="button" className="bg-secondary dark:bg-white dark:text-primary text-white px-1 rounded">Add</button>
        </div>
    )
}
