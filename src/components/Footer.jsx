export default function Footer(){

    const fullYear = (new Date().getFullYear())
    return (
        <footer className="mt-auto">
            <div className="flex justify-center text-sm font-light p-2">company&copy; {fullYear}</div>
        </footer>
    )
}