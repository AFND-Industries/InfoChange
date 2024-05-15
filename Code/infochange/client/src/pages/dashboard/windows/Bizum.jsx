import { useAPI } from "../../../context/APIContext";

export default function Bizum({ user }) {
    const { getPair } = useAPI();

    return (
        <>
            <div className="row px-5 py-4">
                <div className="col">
                    <h2 className="text-center">Hacer un Bizum</h2>
                </div>
            </div>
        </>
    );
}
