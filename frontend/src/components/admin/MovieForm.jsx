import { useState } from "react";
import { useNotification } from "../../hooks";
import { languageOptions, statusOptions, typeOptions } from "../../utils/options";
import { commonInputClasses } from "../../utils/theme";
import DirectorSelector from "../DirectorSelector";
import CastForm from "../form/CastForm";
import Submit from "../form/Submit";
import GenresSelector from "../GenresSelector";
import Label from "../Label";
import LabelWithBadge from "../LabelWithBadge";
import CastModal from "../modals/CastModal";
import GenresModal from "../modals/GenresModal";
import WritersModal from "../modals/WritersModal";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";
import TagsInput from "../TagsInput";
import ViewAllBtn from "../ViewAllBtn";
import WritersSelector from "../WritersSelector";

const defaultMovieInfo = {
    title: '',
    storyLine: '',
    tags: [],
    cast: [],
    director: {},
    writers: [],
    releaseDate: '',
    poster: null,
    genres: [],
    type: '',
    language: '',
    status: ''
}

export default function MovieForm() {
    const { updateNotification } = useNotification();

    const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
    const [showWritersModal, setShowWritersModal] = useState(false);
    const [showCastModal, setShowCastModal] = useState(false);
    const [selectedPosterForUI, setSelectedPosterForUI] = useState('');
    const [showGenresModal, setShowGenresModal] = useState(false);

    const updatePosterForUI = file => {
        const url = URL.createObjectURL(file);
        setSelectedPosterForUI(url)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(movieInfo);
    };

    const handleChange = ({ target }) => {
        const { value, name, files } = target;
        if (name === 'poster') {
            const poster = files[0];
            updatePosterForUI(poster)
            return setMovieInfo({ ...movieInfo, poster });
        }

        setMovieInfo({ ...movieInfo, [name]: value });
    }

    const updateTags = (tags) => {
        setMovieInfo({ ...movieInfo, tags })
    }

    const updateDirector = (profile) => {
        setMovieInfo({ ...movieInfo, director: profile });
    }

    const updateCast = (castInfo) => {
        const { cast } = movieInfo
        setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] })
    }

    const updateWriters = (profile) => {
        const { writers } = movieInfo;
        for (let writer of writers) {
            if (writer.id === profile.id) {
                return updateNotification('warning', 'This profile is already selected')
            }
        }
        setMovieInfo({ ...movieInfo, writers: [...writers, profile] })
    }

    const updateGenres = (genres) => {
        setMovieInfo({ ...movieInfo, genres });
    }

    const hideWritersModal = () => {
        setShowWritersModal(false)
    }

    const displayWritersModal = () => {
        setShowWritersModal(true)
    }

    const handleWriterRemove = (profileId) => {
        const { writers } = movieInfo;
        const newWriters = writers.filter(({ id }) => id !== profileId)
        if (!newWriters.length) hideWritersModal()
        setMovieInfo({ ...movieInfo, writers: [...newWriters] })
    }

    const hideCastModal = () => {
        setShowCastModal(false)
    }

    const displayCastModal = () => {
        setShowCastModal(true)
    }

    const handleCastRemove = (profileId) => {
        const { cast } = movieInfo;
        const newCast = cast.filter(({ profile }) => profile.id !== profileId)
        if (!newCast.length) hideCastModal()
        setMovieInfo({ ...movieInfo, cast: [...newCast] })
    }

    const hideGenresModal = () => {
        setShowGenresModal(false)
    }

    const displayGenresModal = () => {
        setShowGenresModal(true)
    }

    const { title, storyLine, writers, cast, tags, genres, type, language, status } = movieInfo;

    return (
        <>
            <div className="flex space-x-3">
                <div className="w-[70%] space-y-5">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <input id="title" name="title" value={title} onChange={handleChange} type="text" className={commonInputClasses + " border-b-2 font-semibold text-xl"} placeholder="Titanic" />
                    </div>

                    <div>
                        <Label htmlFor="storyLine">Story line</Label>
                        <textarea name="storyLine" value={storyLine} onChange={handleChange} id="storyLine" className={commonInputClasses + " border-b-2 resize-none h-24"} placeholder="Movie storyline..."></textarea>
                    </div>

                    <div>
                        <Label htmlFor="tags">Tags</Label>
                        <TagsInput value={tags} name="tags" onChange={updateTags} />
                    </div>

                    <DirectorSelector onSelect={updateDirector} />

                    <div>
                        <div className="flex justify-between">
                            <LabelWithBadge badge={writers.length} htmlFor="writers">Writers</LabelWithBadge>
                            <ViewAllBtn visible={writers.length} onClick={displayWritersModal}>View All</ViewAllBtn>
                        </div>
                        <WritersSelector onSelect={updateWriters} />
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <LabelWithBadge badge={cast.length}>Add Cast & Crew</LabelWithBadge>
                            <ViewAllBtn onClick={displayCastModal} visible={cast.length}>View All</ViewAllBtn>
                        </div>
                        <CastForm onSubmit={updateCast} />
                    </div>

                    <input type="date" onChange={handleChange} name="releaseDate" className={commonInputClasses + " border-2 rounded p-1 w-auto"} />
                    <Submit value='Upload' onClick={handleSubmit} type='button' />
                </div>
                <div className="w-[30%] space-y-5">
                    <PosterSelector name="poster" onChange={handleChange} selectedPoster={selectedPosterForUI} label="Select Poster" accept="image/jpg, image/jpeg, image/png" />

                    <GenresSelector badge={genres.length} onClick={displayGenresModal} />

                    <Selector onChange={handleChange} name="type" value={type} options={typeOptions} label="Type" />
                    <Selector onChange={handleChange} name="language" value={language} options={languageOptions} label="Language" />
                    <Selector onChange={handleChange} name="status" value={status} options={statusOptions} label="Status" />
                </div>
            </div>
            <WritersModal onClose={hideWritersModal} profiles={writers} visible={showWritersModal} onRemoveClick={handleWriterRemove} />
            <CastModal onClose={hideCastModal} casts={cast} visible={showCastModal} onRemoveClick={handleCastRemove} />
            <GenresModal onSubmit={updateGenres} visible={showGenresModal} onClose={hideGenresModal} previousSelection={genres} />
        </>
    );
}