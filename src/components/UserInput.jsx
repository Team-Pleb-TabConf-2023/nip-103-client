import { useState } from 'react'
import { Input, Button } from '@chakra-ui/react'

import "./components.css"

const UserInput = () => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        console.log(inputValue);
    }

    return (
        <div className='input-container'>
            <Input 
                placeholder="Basic usage" 
                bg={"ghostwhite"} 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <Button onClick={handleSubmit} colorScheme='telegram' mx={4}>Submit</Button>
        </div>
    )
}

export default UserInput;
