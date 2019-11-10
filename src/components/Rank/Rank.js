import React from 'react';

const Rank = ({ name, entries }) => {
  return (
    <div>
    <iframe title='intro' width="560" height="315" src="https://www.youtube.com/embed/SYnh2wd3lCg" frameborder="0" allowfullscreen>
    </iframe>
      <div className='white f3'>
        {`${name}, your current entry count is ...`}
      </div>
      <div className='white f1'>
      {entries}
      </div>
    </div>
  );
}

export default Rank;