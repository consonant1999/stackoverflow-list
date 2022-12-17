import React from "react";
import styled from 'styled-components';
import { useListContext } from '../ListContext';

const Tag = ({ isSelected, children, onClick }) => {
  const { state } = useListContext();
  const { status } = state;
  const isLoading = status === 'listLoading' || status === 'tagLoading'
  console.log(status, 'status')
  return (
    <StyledTag
      isSelected={isSelected}
      onClick={isLoading ? () => {} : onClick}
    >
      {children}
    </StyledTag>
  )
}

const StyledTag = styled.div`
  padding: 0.5rem 0.25rem;
  border-radius: 8px;
  border: 2px solid #24BB9D;
  margin-right: 0.5rem;
  cursor: pointer;
  background: ${props => props.isSelected ? '#FFAE33' : '#FFF'};
  &:last-child {
    margin-right: 0;
  }
`;

export default Tag;