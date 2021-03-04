import { Fragment } from 'react';

import CheckBox from './components/CheckBox';
import Label from './components/Label';
import List from './components/List';
import ListItem from './components/ListItem';

import useTree from './hooks/useTree';

import {DATA_LIST} from './response'

import './App.css';

function App() {
  const {data, setData} = useTree(DATA_LIST)

  const toggle = (id, data) => {
    data.forEach(element => {
      if(element.id === id){
        element.expand = !element.expand ? true : false;
      }else{
        toggle(id,element.children)
      }
    });
    setData(data => [...data]);
  }

  const checkChildren = (checked, data) => {
    data.forEach(i => {
      i.checked = checked;
      if(i.children.length){
        checkChildren(checked, i.children)
      }
    })
  }

  const checkParent = (parentId, checked, dataArray = data) => {
    dataArray.forEach((i)=> {
      const {id, parent, children} = i
      if(id == parentId) {
        i.checked = !children.find(({checked})=> !checked)? true : false
        checkParent(parent)
      }else {
        checkParent(parentId, checked, children)
      }
    })
    setData(data=> [...data]);
  }

  const handleChangeCheckBox = (node, checked, data) => {
    if(node){
      data.forEach(element => {
        if(element.id === node.id){
          element.checked = checked;
          checkChildren(checked,element.children);
          checkParent(node.parent,checked);
        }else {
          handleChangeCheckBox(node.id, checked, element.children)
        }
      });
      setData(data=> [...data]);
    }
  }

  const checkBoxList = (data, shouldExpand = false) => {
    return (
      <List>
        {
          data.map(i => {
            const {id, name, parent, expand, children, checked} = i;
            if(shouldExpand || parent ==='0') {
              return (
                <ListItem key={id}>
                  <CheckBox 
                    onChange={(e) => handleChangeCheckBox(i, e.target.checked,data)} 
                    checked={checked} 
                  />
                  <Label onClick={()=> toggle(id,data)}>{name}</Label> 
                  {checkBoxList(children, expand)}
                </ListItem>
              );
            }else {
              return <Fragment />
            }
          })
        }
      </List>
    );
  }

  return checkBoxList(data)
}

export default App;
