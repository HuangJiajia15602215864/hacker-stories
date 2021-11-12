import React from "react";
const storiesReducer = (state, action) => {
  if (action.type === 'SET_STORIES') {
    return action.payload;
  } else {
    throw new Error();
  }
};
const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];
// 函数组件
const App = () => {
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    []
  );
};

const List = props =>
  props.list.map(item => (
    <div key={item.objectID}>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
    </div>
  ));

const storiesReducer = (state, action) => {
  if (action.type === 'SET_STORIES') {
    return action.payload;
  } else if (action.type === 'REMOVE_STORY') {
    return state.filter(
      story => action.payload.objectID !== story.objectID
    );
  } else {
    throw new Error();
  }
};
const App = () => {
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    []
  );
  const [searchTerm, setSearchTerm] = React.useState('React');
  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };
  const searchedStories = stories.filter(function (story) {
    return story.title.includes(searchTerm);
  });
  React.useEffect(() => {
    setIsLoading(true);
    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: 'SET_STORIES',
          payload: result.data.stories,
        });
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);
  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  return (
    <div>
      <Search search={searchTerm} onSearch={handleSearch} />
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
};

const Search = ({ search, onSearch }) => (
  <div>
    <input
      id="search"
      type="text"
      value={search}
      onChange={onSearch}
    />
  </div>
);
export default App;
