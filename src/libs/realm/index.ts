import {createRealmContext} from "@realm/react";
import {Historic} from "./schemas/Historic";
import Realm from "realm"

// Realm.flags.THROW_ON_GLOBAL_REALM = false

export const {RealmProvider, useRealm, useQuery, useObject} = createRealmContext({
    schema: [Historic]
});