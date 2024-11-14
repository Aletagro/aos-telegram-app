import React from 'react';
import {isCloudStorageSupported, initData} from '@telegram-apps/sdk';

const Developer = () => {
    const user = initData.user();
    return <div>
        <p>test</p>
        <p>isCloudStorageSupported: {isCloudStorageSupported()}</p>
        <p>user: {user}</p>
    </div>
}

export default Developer