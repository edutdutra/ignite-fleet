import {createRealmContext} from "@realm/react";
import {Historic} from "./schemas/Historic";
import {Coords} from "./schemas/Coords";
import Realm from "realm"

// Realm.flags.THROW_ON_GLOBAL_REALM = false

const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
    type: Realm.OpenRealmBehaviorType.OpenImmediately
}

export const syncConfig: any = {
    flexible: true,
    newRealmFileBehavior: realmAccessBehavior,
    existingRealmFileBehavior: realmAccessBehavior
}

export const {RealmProvider, useRealm, useQuery, useObject} = createRealmContext({
    schema: [Historic, Coords],
    schemaVersion: 1
});