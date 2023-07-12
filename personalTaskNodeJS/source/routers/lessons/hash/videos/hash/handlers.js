export const getVideoByLessons = (req, res) => {
    try {
        res.status(200).json()
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}
export const deleteVideoByLessons = (req, res) => {
    try {
        res.status(204).json()
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}