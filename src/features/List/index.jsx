import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from 'styled-components';
import { useListContext } from './ListContext';
import { Tag, ListItem, ListSpinner, TagSpinner } from './components';

const List = () => {
  const [currentTag, setCurrentTag] = useState('');
  const { state, getTags, getLists, goNextPage } = useListContext();
  const { status, tags, listItems } = state;
  let bottomBoundaryRef = useRef(null);
  const scrollObserver = useCallback(
    node => {
      new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.intersectionRatio > 0 && status !== 'listLoading') {
            console.log(currentTag, 'currentTag')
            goNextPage(currentTag);
          }
        });
      }).observe(node);
    },
    [currentTag, goNextPage, status]
  );
  useEffect(() => {
    if (bottomBoundaryRef.current && listItems.length > 19) {
      scrollObserver(bottomBoundaryRef.current);
    }
  }, [scrollObserver, bottomBoundaryRef, listItems.length]);

  useEffect(() => {
    getTags();
  }, [getTags]);

  useEffect(() => {
    if(tags.length > 0) setCurrentTag(tags[0].name);
  }, []);

  useEffect(() => {
    if(currentTag) {
      getLists(currentTag)
    };
  }, [currentTag, getLists]);

  return (
    <Wrapper>
      <StyledSearchBar>
        <input type="text" />
        <button>search</button>
        <div>{currentTag}</div>
      </StyledSearchBar>
      <Title>Trending</Title>
      {status === 'tagLoading' ? <TagSpinner/> : <TagsWrapper>
        {tags.length > 0 && tags.map((tag) => {
          return (
            <Tag
              key={`${tag.name}${tag.count}`}
              isSelected={currentTag === tag.name}
              onClick={() => {
                setCurrentTag(tag.name);
              }}
            >
              {tag.name}
            </Tag>
          )
        })}
      </TagsWrapper>}
      <ListItemsWrapper>
        {listItems.length > 0 && listItems.map((list, index) => {
          return (
            <ListItem key={`${list.link}${index}`} listData={list}/>
          )
        })}
      </ListItemsWrapper>
      {status === 'listLoading' && <ListSpinner/>}
      <div ref={bottomBoundaryRef}/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`;
const StyledSearchBar = styled.div`
  position: sticky;
  top: 2rem;
  background: #FFF;
  width: 100%;
  text-align: center;
`;
const Title = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;
const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;
const ListItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  max-width: 37.5rem;
`;

export default List;