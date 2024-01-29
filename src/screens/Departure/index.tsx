import {useRef} from "react";
import {KeyboardAvoidingView, Platform, ScrollView, TextInput} from "react-native";

import {Header} from "../../components/Header";
import {Button} from "../../components/Button";
import {TextAreaInput} from "../../components/TextAreaInput";
import {LicensePlateInput} from "../../components/LicensePlateInput";

import {Container, Content} from "./styles";

const KeyboardAvoidingViewBehavior = Platform.OS === 'android' ? 'height' : 'position'

export function Departure() {
    const descriptionRef = useRef<TextInput>(null);

    function handleDepartureRegister() {
        console.log('OK')
    }

    return (
        <Container>
            <Header title="Saída"/>

            <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehavior}>
                <ScrollView>
                    <Content>
                        <LicensePlateInput
                            label="Placa do veículo"
                            placeholder="BRA1234"
                            onSubmitEditing={() => descriptionRef.current?.focus()}
                            returnKeyType="next"
                        />

                        <TextAreaInput
                            ref={descriptionRef}
                            label="Finalidade"
                            placeholder="Vou utilizar o veículo para..."
                            onSubmitEditing={handleDepartureRegister}
                            returnKeyType="send"
                            blurOnSubmit
                        />

                        <Button
                            title="Registrar saída"
                            onPress={handleDepartureRegister}
                        />
                    </Content>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
}