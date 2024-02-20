import {Car, FlagCheckered} from "phosphor-react-native";
import {LocationInfo, LocationInfoProps} from "../LocationInfo";

import {Container, Line} from "./styles";


type Props = {
    departure: LocationInfoProps,
    arrival?: LocationInfoProps | null
}

export function Locations({departure, arrival = null}: Props) {
    return (
        <Container>
            <LocationInfo
                label={departure.label}
                description={departure.description}
                icon={Car}
            />

            {
                arrival && <>
                    <Line/>

                    <LocationInfo
                        label={arrival.label}
                        description={arrival.description}
                        icon={FlagCheckered}
                    />
                </>
            }
        </Container>
    )
}