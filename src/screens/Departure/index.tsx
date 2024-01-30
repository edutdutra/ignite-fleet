import {useUser} from "@realm/react";
import {useRef, useState} from "react";
import {useRealm} from "../../libs/realm";
import {Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput} from "react-native";

import {Historic} from "../../libs/realm/schemas/Historic";

import {licensePlateValidate} from "../../utils/licensePlateValidate";

import {Header} from "../../components/Header";
import {Button} from "../../components/Button";
import {TextAreaInput} from "../../components/TextAreaInput";
import {LicensePlateInput} from "../../components/LicensePlateInput";

import {Container, Content} from "./styles";
import {useNavigation} from "@react-navigation/native";

const KeyboardAvoidingViewBehavior = Platform.OS === 'android' ? 'height' : 'position'

export function Departure() {
    const [description, setDescription] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const {goBack} = useNavigation();
    const realm = useRealm();
    const user = useUser();

    const descriptionRef = useRef<TextInput>(null);
    const licensePlateRef = useRef<TextInput>(null);

    function handleDepartureRegister() {
        try {
            if (!licensePlateValidate(licensePlate)) {
                licensePlateRef.current?.focus()
                return Alert.alert('Placa inválida', 'A placa é inválida. Por favor, informe a placa correta do veículo.');
            }

            if (description.trim().length === 0) {
                descriptionRef.current?.focus()
                return Alert.alert('Finalidade', 'Por favor, informe a finalidade da utilização do veículo.');
            }

            setIsRegistering(true);

            realm.write(() => {
                realm.create('Historic', Historic.generate({
                    user_id: user!.id,
                    license_plate: licensePlate.toUpperCase(),
                    description: description
                }))
            })

            Alert.alert('Saída', 'Saída do veículo registrada com sucesso!')
            goBack()
        } catch (error) {
            console.log(error)
            return Alert.alert('Erro', 'Não foi possível registrar a saída do veículo.');
        } finally {
            setIsRegistering(false);
        }
    }

    return (
        <Container>
            <Header title="Saída"/>

            <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehavior}>
                <ScrollView>
                    <Content>
                        <LicensePlateInput
                            ref={licensePlateRef}
                            label="Placa do veículo"
                            placeholder="BRA1234"
                            onSubmitEditing={() => descriptionRef.current?.focus()}
                            returnKeyType="next"
                            onChangeText={setLicensePlate}
                        />

                        <TextAreaInput
                            ref={descriptionRef}
                            label="Finalidade"
                            placeholder="Vou utilizar o veículo para..."
                            onSubmitEditing={handleDepartureRegister}
                            returnKeyType="send"
                            blurOnSubmit
                            onChangeText={setDescription}
                        />

                        <Button
                            title="Registrar saída"
                            onPress={handleDepartureRegister}
                            isLoading={isRegistering}
                        />
                    </Content>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
}