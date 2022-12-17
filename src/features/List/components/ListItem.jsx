import React, { useEffect, useRef, useCallback } from "react";
import styled from 'styled-components';

const openInNewTab = url => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
const ListItem = ({ listData }) => {
  const imagesRef = useRef(null);
  const imgObserver = useCallback(node => {
    const intObs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.intersectionRatio > 0) {
          const currentImg = en.target;
          const newImgSrc = currentImg.dataset.src;
          if (!newImgSrc) {
            console.error('Image source is invalid');
          } else {
            currentImg.src = newImgSrc;
          }
          intObs.unobserve(node);
        }
      });
    })
    intObs.observe(node);
  }, []);
  useEffect(() => {
    imagesRef.current = document.querySelectorAll('.img-target');
    if (imagesRef.current) {
      imagesRef.current.forEach(img => imgObserver(img));
    }
  }, [imgObserver, imagesRef]);


  const { title, score, answer_count, view_count, owner, link, is_answered} = listData;
  const { display_name, profile_image} = owner;
  return (
    <ListItemWrapper onClick={() => openInNewTab(link)}>
      <ListItemTitle>{title}</ListItemTitle>
      <ListItemContent>
        <SectionWrapper>
          <ListItemContentHeader>Score</ListItemContentHeader>
          <StyledScore isMinus={score < 0}>{score}</StyledScore>
        </SectionWrapper>
        <SectionWrapper>
          <ListItemContentHeader>Answers</ListItemContentHeader>
          <StyledAnswer hasAnswer={answer_count > 0} isAnswered={is_answered}>{answer_count}</StyledAnswer>
        </SectionWrapper>
        <SectionWrapper>
          <ListItemContentHeader>Viewed</ListItemContentHeader>
          <div>{view_count}</div>
        </SectionWrapper>
        <SectionWrapper>
          <StyledAvatar
            className="img-target"
            data-src={profile_image}
            src='https://via.placeholder.com/100.webp'
            alt="user avatar"
          />
          <div>{display_name}</div>
        </SectionWrapper>
      </ListItemContent>
    </ListItemWrapper>
  )
}

const StyledAvatar = styled.img`
  height: 3rem;
  weight: 3rem;
  border-radius: 50%;
`;
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ListItemWrapper = styled.div`
  display: block;
  cursor: pointer;
  border-bottom: 1px solid #333;
  &:last-child {
    border-bottom: none;
  }
`;
const ListItemTitle = styled.h1`
  font-size: 1rem;
`;
const ListItemContent = styled.h1`
  display: flex;
  justify-content: space-around;
  font-size: 0.875rem;
`;
const ListItemContentHeader = styled.h1`
  color: #D53113;
  font-size: 0.875rem;
`;
const StyledScore = styled.div`
  color: ${props => props.isMinus ? '#E7300E' : '#333'};
`;
const StyledAnswer = styled.div`
  background: ${props => props.isAnswered ? '#19871F' : '#FFF'};
  border: ${props => props.hasAnswer ? '1px solid #19871F' : 'none'};
  color: ${props => props.isAnswered ? '#FFF' : '#333'};
  width: 4.5rem;
  text-align: center;
  padding: 0.25rem;
`;
export default ListItem;