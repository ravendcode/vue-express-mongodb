import path from 'path'
import config from '../config'

export default (req, res) => {
  res.sendFile(path.join(config.publicDir, 'index.html'))
}
