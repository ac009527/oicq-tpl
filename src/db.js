import lodash from 'lodash'
import path from 'path'
import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import { fileURLToPath } from 'node:url'
// Extend Low class with a new `chain` field
const __dirname = path.dirname(fileURLToPath(import.meta.url));
class LowWithLodash extends LowSync {
    chain = lodash.chain(this).get('data')
}
const createJsonDb = (file) => {
    const adapter = new JSONFileSync((path.join(__dirname,file)))
    const db = new LowWithLodash(adapter)
    db.read()
    if (!db.data) {
        db.data = []
        db.write()
    }
    return db
}
const userDb = createJsonDb('../db/user.json')
const adminDb = createJsonDb('../db/admin.json')
const groupWhiteListDb = createJsonDb('../db/groupWhiteList.json')
const privateWhiteListDb = createJsonDb('../db/privateWhiteList.json')

console.log(adminDb)
export { userDb, adminDb, groupWhiteListDb, privateWhiteListDb };