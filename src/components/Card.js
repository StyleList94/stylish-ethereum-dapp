import styled from '@emotion/styled';

const CardSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 375px;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 5px 1px 10px 0 rgba(206, 212, 218, 0.2);
`;

const CardTitle = styled.h2`
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: normal;
  font-size: 1.25rem;
  text-align: center;
`;

const CardContentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem 0;
`;

const CardContentItem = styled.section`
  h3 {
    font-family: 'Inter', sans-serif;
    font-weight: normal;
    font-size: 1rem;
    color: #adb5bd;
  }

  p {
    overflow-x: auto;
    margin-top: 0.25rem;
    font-family: 'Roboto', sans-serif;
    font-size: 1.25rem;

    &::-webkit-scrollbar {
      background-color: #fff;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(206, 212, 218, 0.5);
      border-radius: 24px;
    }
  }
`;

const CardActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #f1f3f5;
  border-radius: 12px;
`;

const CardResultBox = styled.div`
  h3 {
    font-family: 'Inter', sans-serif;
    font-weight: normal;
    font-size: 1rem;
    color: #adb5bd;
  }

  p {
    overflow-x: auto;
    margin-top: 0.25rem;
    font-family: 'Roboto', sans-serif;
    font-size: 0.8755rem;

    &::-webkit-scrollbar {
      background-color: #fff;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(206, 212, 218, 0.5);
      border-radius: 24px;
    }
  }
`;

const Card = {
  ActionGroup: CardActionGroup,
  ContentItem: CardContentItem,
  ContentList: CardContentList,
  Section: CardSection,
  Title: CardTitle,
  ResultBox: CardResultBox,
};

export default Card;
