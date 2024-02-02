import {Alert, FlatList} from "react-native";
import {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";

import {CarStatus} from "../../components/CarStatus";
import {HomeHeader} from "../../components/HomeHeader";
import {HistoricCard, HistoricCardProps} from "../../components/HistoricCard";

import {Container, Content, Label, Title} from "./styles";

import Realm from "realm"
import {useUser} from "@realm/react";
import {useQuery, useRealm} from "../../libs/realm";
import {Historic} from "../../libs/realm/schemas/Historic";

import dayjs from "dayjs";
import {getLastSyncTimestamp, saveLastSyncTimestamp} from "../../libs/asyncStorage/syncStorage";

export function Home() {
    const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
    const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>([]);

    const realm = useRealm();
    const user = useUser();
    const {navigate} = useNavigation();
    const historic = useQuery(Historic);

    function handleRegisterMovement() {
        if (vehicleInUse?._id) {
            return navigate('arrival', {id: vehicleInUse._id.toString()});
        } else {
            navigate('departure')
        }
    }

    function fetchVehicleInUse() {
        try {
            const vehicle = historic.filtered("status = 'departure'")[0];
            setVehicleInUse(vehicle)

        } catch (error) {
            console.log(error)
            Alert.alert('Veículo em uso', 'Não foi possível carregar o veículo em uso.');
        }
    }

    async function fetchHistoric() {
        try {
            const response = historic.filtered("status = 'arrival' SORT(created_at DESC)");

            const lastSync = await getLastSyncTimestamp();

            const formattedHistoric = response.map((item) => {
                return {
                    id: item._id!.toString(),
                    licensePlate: item.license_plate,
                    isSync: lastSync > item.updated_at!.getTime(),
                    created: dayjs(item.created_at).format('[Saída em] DD/MM/YYYY [às] HH:mm'),
                }
            })

            setVehicleHistoric(formattedHistoric)
        } catch (error) {
            console.log(error)
            Alert.alert('Veículo em uso', 'Não foi possível carregar o histórico.');
        }

    }

    function handleHistoricDetails(id: string) {
        navigate('arrival', {id})
    }

    async function progressNotification(transferred: number, transferable: number) {
        const percentage = (transferred / transferable) * 100;

        if (percentage === 100) {
            await saveLastSyncTimestamp();

            fetchHistoric();
        }
    }

    useEffect(() => {
        fetchVehicleInUse();
    }, []);

    useEffect(() => {
        realm.addListener('change', () => fetchVehicleInUse());

        return () => {
            if (realm && !realm.isClosed) {
                realm.removeListener('change', fetchVehicleInUse);
            }
        }
    }, []);

    useEffect(() => {
        fetchHistoric();
    }, [historic]);

    useEffect(() => {
        realm.subscriptions.update((mutableSubscriptions, realm) => {
            const historicByUserQuery = realm.objects('Historic').filtered(`user_id = '${user!.id}'`);

            mutableSubscriptions.add(historicByUserQuery, {name: 'historic_by_user'})
        })
    }, [realm]);

    useEffect(() => {
        const syncSession = realm.syncSession;

        if (!syncSession) {
            return
        }

        syncSession.addProgressNotification(
            Realm.ProgressDirection.Upload,
            Realm.ProgressMode.ReportIndefinitely,
            progressNotification
        )

        return () => syncSession.removeProgressNotification(progressNotification)
    }, [realm]);

    return (
        <Container>
            <HomeHeader/>

            <Content>
                <CarStatus
                    licensePlate={vehicleInUse?.license_plate}
                    onPress={handleRegisterMovement}
                />

                <Title>
                    Histórico
                </Title>

                <FlatList
                    data={vehicleHistoric}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <HistoricCard data={item} onPress={() => handleHistoricDetails(item.id)} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 100}}
                    ListEmptyComponent={(
                        <Label>
                            Nenhum registro de utilização
                        </Label>
                    )}
                />
            </Content>
        </Container>
    );
}