export const addKeynotesTheLesson = (req, res) => {
    try {
        res.status(204).json();
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}