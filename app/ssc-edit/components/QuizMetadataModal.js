import { useState } from "react";

export const QuizMetadataModal = ({ quiz, onClose, onSave }) => {
    const [editedQuiz, setEditedQuiz] = useState({ ...quiz });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedQuiz(prev => ({
            ...prev,
            [name]: name === "duration" || name === "positiveScore" || name === "negativeScore" 
                ? parseFloat(value) 
                : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedQuiz);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Quiz Metadata</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={editedQuiz.title}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={editedQuiz.description}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnailLink">
                            Thumbnail Link
                        </label>
                        <input
                            type="text"
                            id="thumbnailLink"
                            name="thumbnailLink"
                            value={editedQuiz.thumbnailLink}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            value={editedQuiz.duration}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="positiveScore">
                            Positive Score
                        </label>
                        <input
                            type="number"
                            id="positiveScore"
                            name="positiveScore"
                            value={editedQuiz.positiveScore}
                            onChange={handleChange}
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="negativeScore">
                            Negative Score
                        </label>
                        <input
                            type="number"
                            id="negativeScore"
                            name="negativeScore"
                            value={editedQuiz.negativeScore}
                            onChange={handleChange}
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuizMetadataModal;