export const commonPosterUI = "flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer"

export default function PosterSelector({ name, selectedPoster, onChange, accept, className, label }) {
    return (
        <div>
            <input onChange={onChange} name={name} id={name} type="file" accept={accept} hidden />
            <label htmlFor={name}>
                {selectedPoster ? <img src={selectedPoster} className={commonPosterUI + " object-cover " + className} alt="" /> : <PosterUI label={label} className={className} />}
            </label>
        </div>
    )
}


const PosterUI = ({ className, label }) => {
    return (
        <div className={commonPosterUI + " " + className}>
            <span className="dark:text-dark-subtle text-light-subtle">{label}</span>
        </div>
    );
}