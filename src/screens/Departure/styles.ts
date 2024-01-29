import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.COLORS.GRAY_800};
`

export const Content = styled.View`
  flex: 1;
  padding: 32px;
`

export const Title = styled.Text`
  color: ${({theme}) => theme.COLORS.BRAND_LIGHT};

  font-size: ${({theme}) => theme.FONT_SIZE.XXXL}px;
  font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
  
  text-align: center;
`