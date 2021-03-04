import { useEffect, useState } from "react";

function useTree  (_list) {
    const [data, setData] = useState([]);
    useEffect(()=> {
        makeList()
    },[])
    const setList = (list) => {
        return list.map(i=> {
          const childList = _list.data.categories.filter(j=> j.parent === i.id );
          return {
            ...i,
            children : setList(childList),
            expand: false,
            checked : false
          }
    });
    }
    const makeList = () => {
        var rootElements = _list.data.categories.filter(({parent}) => parent === '0' );
        setData(()=> setList(rootElements))
    }
    return {data, setData}
}

export default useTree;