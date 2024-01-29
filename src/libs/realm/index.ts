import Realm from "realm"
import {createRealmContext} from "@realm/react";
import {Historic} from "./schemas/Historic";

Realm.flags.THROW_ON_GLOBAL_REALM = false

export const {RealmProvider, useRealm, useQuery, useObject} = createRealmContext({
    schema: [Historic]
});