export const getKeynotesByLessons = (req, res) => {
    try {
        res.status(200).json()
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}
export const deleteKeynotesByLessons = (req, res) => {
    try {
        res.status(204).json()
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}