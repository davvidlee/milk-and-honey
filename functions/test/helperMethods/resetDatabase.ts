import deleteUsers from "./deleteUsers";
import clearUsers from "./clearCollections";

export default async () => {
    await deleteUsers()
    await clearUsers()
}