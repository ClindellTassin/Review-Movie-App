export const commonPosterUI = "flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer"

export default function PosterSelector({ name, selectedPoster, onChange, accept }) {
    return (
        <div>
            <input onChange={onChange} name={name} id={name} type="file" accept={accept} hidden />
            <label htmlFor={name}>
                {selectedPoster ? <img src={selectedPoster} className={commonPosterUI + " object-cover"} alt="" /> : <PosterUI />}
            </label>
        </div>
    )
}


const PosterUI = () => {
    return (
        <div className={commonPosterUI}>
            <span className="dark:text-dark-subtle text-light-subtle">Select Poster</span>
        </div>
    );
}