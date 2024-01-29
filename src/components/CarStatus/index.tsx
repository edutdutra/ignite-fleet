import {Container, IconBox, Message, TextHighlight} from "./styles";
import {Car, Key} from "phosphor-react-native";
import theme from "../../theme";
import {TouchableOpacityProps} from "react-native";

type Props = TouchableOpacityProps & {
    licensePlate?: string | null
}

export function CarStatus({licensePlate = null, ...rest}: Props) {
    const Icon = licensePlate ? Key : Car;
    const message = licensePlate ? `Veículo ${licensePlate} em uso. ` : 'Nenhum veículo em uso. ';
    const status = licensePlate ? 'chegada' : 'saída';

    return (
        <Container {...rest}>
            <IconBox>
                <Icon
                    size={32}
                    color={theme.COLORS.BRAND_LIGHT}
                />
            </IconBox>

            <Message>
                {message}

                <TextHighlight>
                    Clique aqui para registrar uma {status}
                </TextHighlight>
            </Message>
        </Container>
    )
}