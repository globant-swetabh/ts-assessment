import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import { error } from 'console';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

interface Item{
    id: string;
    name: string;
    quantity: number;
}

const items: Item[] = [];

//helper to generate unique IDs
const generateId = (): string => {
    return Math.random().toString(36).substr(2,9);
}

//validations
const validateItem = (item: Partial<Item>): {valid: boolean, message?: string} => {
    if(!item.name) return {valid: false, message: 'name is required'};
    if(typeof item.name !== 'string') return {valid: false, message: 'name must be string'}
    if(item.quantity === undefined) return {valid: false, message: 'quantity is required'}
    if(typeof item.quantity !== 'number') return {valid: false, message: 'quantity must be a number'}
    return {valid: true}
}

//create
app.post('/items', (req: Request, res: Response) => {
    const { name, quantity } = req.body;
    const validation = validateItem({name, quantity});
    if(!validation.valid){
        return res.status(400).json({error: validation.message})
    }

    const newItem: Item = { id: generateId(), name, quantity};
    items.push(newItem);
    res.status(201).json(newItem);

})

//read all
app.get('/items', (req: Request, res: Response) => {
    res.json(items)
})

//read one
app.get('/items/:itemId', (req: Request, res: Response) => {
    const item = items.find(item => item.id === req.params.itemId)
    res.json(item)
})

//update
app.put('/items/:itemId', (req: Request, res: Response) => {
    const item = items.find(item => item.id === req.params.itemId)
    if(!item){
        return res.status(404).json({error: 'item not found'})
    }

    const {name, quantity} =  item;
    const validation = validateItem({name, quantity});
    if(!validation.valid){
        return res.status(400).json({error: validation.message})
    }

    item.name = name;
    item.quantity = quantity;
    res.json(item)
})

//delete
app.delete('/delete/:itemId', (req: Request, res: Response) => {
    const index = items.findIndex(i => i.id === req.params.itemId)
    if(index === -1){
        return res.status(404).json({error: 'item not found'})
    }
    items.splice(index, 1)
    res.status(204).send();
})

app.listen(PORT, () => {
    console.log('server up at localhost:3000');
    
})
