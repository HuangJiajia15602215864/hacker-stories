import React from "react";
import axios from 'axios';

import styles from './App.module.css';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

function App() {
  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem("search") || "react"
  );
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);
  // 每当其依赖数组[url]改变时这个 Hook 就会创建一个 memoized 函数(即重新定义handleFetchStories函数),useEffect Hook 依赖于新的函数所以它会再次运行

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List
          list={stories.data}
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  );
}

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={onSearchSubmit} className={styles.searchForm}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>
    <button type="submit" disabled={!searchTerm} className={`${styles.button} ${styles.buttonLarge}`}>
      Submit
    </button>
  </form>
);

// const InputWithLabel = ({
//   id,
//   value,
//   type = "text",
//   onInputChange,
//   isFocused,
//   children,
// }) => {
//   const inputRef = React.useRef();
//   React.useEffect(() => {
//     if (isFocused && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isFocused]);

//   return (
//     <>
//       <label htmlFor={id}>{children}</label>
//       &nbsp;
//       <input ref={inputRef} id={id} type={type} value={value} onChange={onInputChange} />
//     </>
//   );
// };

class InputWithLabel extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  componentDidMount() {
    if (this.props.isFocused) {
      this.inputRef.current.focus();
    }
  }
  render() {
    const {
      id,
      value,
      type = 'text',
      onInputChange,
      children,
    } = this.props;
    return (<><label htmlFor={id}  className={styles.label}>{children}</label> &nbsp;
      <input
        ref={this.inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className={styles.input}
      /> </>
    );
  }
}

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));

const Item = ({ item, onRemoveItem }) => (
  <div className={styles.item}>
    <span style={{ width: '40%' }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30%' }}>{item.author}</span>
    <span style={{ width: '10%' }}>{item.num_comments}</span>
    <span style={{ width: '10%' }}>{item.points}</span>
    <span style={{ width: '10%' }}>
      <button
        type="button"
        onClick={() => onRemoveItem(item)}
        className={`${styles.button} ${styles.buttonSmall}`}
      >
        Dismiss
      </button>
    </span>
  </div>
);
export default App;
