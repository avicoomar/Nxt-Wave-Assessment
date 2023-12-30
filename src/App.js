import './App.css';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';



function App() {
  var [items, setItems] = useState([])
  var [listMap, setListMap] = useState(new Map())
  var [twoListsSelected, setTwoListsSelected] = useState(true)
  var [editMode, setEditMode] = useState(false);
  var [selected, setSelected] = useState([])
  var [tmpList, setTmpList] = useState([]);

  const createNewList = (event) => {
    event.preventDefault();
    let countOfListsSelected = 0;
    let tmp = [];
    Array.from(event.target.elements).forEach(ele => {
      if (ele.checked) {
        tmp.push(ele.name);
        countOfListsSelected++;
      }
    })
    setSelected(tmp);
    if (countOfListsSelected == 2) {
      setTwoListsSelected(true);
      setEditMode(true);
    }
    else {
      setTwoListsSelected(false);
    }
  }

  const cancelEdit = () => {
    setEditMode(false);
  }

  const removeAndAdd = (listNumber, index, element) => {
    //remove part
    const XD = new Map(listMap);
    XD.get(parseInt(listNumber)).splice(index, 1);
    setListMap(XD);

    //add part
    const DX = new Map(listMap);
    if (typeof DX.get(parseInt(selected[1]) + 1) === 'undefined') {
      DX.set(parseInt(selected[1]) + 1, [])
      DX.get(parseInt(selected[1]) + 1).push(element);
    }
    else
      DX.get(parseInt(selected[1]) + 1).push(element);
    setListMap(DX);

    console.log(DX);

  }

  const removeAndAdd2 = (listNumber, index, element, listNumberOntoBeAdded) => {
    //remove part
    const XD = new Map(listMap);
    XD.get(parseInt(listNumber)).splice(index, 1);
    setListMap(XD);

    // //add part
    const DX = new Map(listMap);
    DX.get(parseInt(listNumberOntoBeAdded)).push(element);
    setListMap(DX);

    console.log(DX);

  }
  useEffect(() => {
    fetch("https://apis.ccbp.in/list-creation/lists")
      .then(response => response.json())
      .then(data => {
        setItems(data.lists);
        let tmp1 = [];
        let tmp2 = [];
        data.lists.forEach(element => {
          if (element.list_number == 1)
            tmp1.push(element.name + "-" + element.description);
          if (element.list_number == 2)
            tmp2.push(element.name + "-" + element.description);
        });
        const newMap = new Map(listMap);
        newMap.set(newMap.size + 1, tmp1);
        newMap.set(newMap.size + 1, tmp2);
        setListMap(newMap);
      })
  }, [])

  return (
    <div className="App">

      {!editMode && <Form onSubmit={createNewList}>
        <h2>
          List Creation
        </h2>
        <br />
        <Button variant="primary" type="submit">Create a new list</Button>
        {!twoListsSelected && <p style={{ color: 'red' }}>You should select exactly 2 lists to create a new List</p>}
        <Container>
          <Row>
            {Array.from(listMap).map(([key, value]) => {
              return <Col>
                <Form.Check
                  type="checkbox"
                  name={key} />
                <Form.Label>
                  <h3>List {key}</h3>
                </Form.Label>
                <Form.Text>
                  {value.map(ele => <Card>
                    <Card.Title>{ele.split("-")[0]}</Card.Title>
                    <Card.Body>{ele.split("-")[1]}</Card.Body>
                  </Card>)}
                </Form.Text>
              </Col>
            })}
          </Row>
        </Container>
      </Form>}

      {editMode &&
        <>
          <Container>
            <Row>
              <Col>
                <h4>List {selected[0]}</h4>
                {listMap.get(parseInt(selected[0])).map((element, index) =>
                  <><Card>
                    <Card.Title>{element.split("-")[0]}</Card.Title>
                    <Card.Body>{element.split("-")[1]}</Card.Body>
                    <Card.Footer><Button variant="outline-secondary" onClick={() => { removeAndAdd(selected[0], index, element) }}>&rarr;</Button></Card.Footer>
                  </Card><br /><br /></>
                )}
              </Col>
              <Col>
                <h4>List {(parseInt(selected[1]) + 1)}</h4>
                {listMap.get(parseInt(selected[1]) + 1) && listMap.get(parseInt(selected[1]) + 1).map((element,index) =>
                  <><Card>
                    <Card.Header><Button variant="outline-secondary" onClick={() => { removeAndAdd2(parseInt(selected[1]) + 1, index, element, selected[0]) }}>&larr;</Button></Card.Header>
                    <Card.Title>{element.split("-")[0]}</Card.Title>
                    <Card.Body>{element.split("-")[1]}</Card.Body>
                    <Card.Footer><Button variant="outline-secondary" onClick={() => { removeAndAdd2(parseInt(selected[1]) + 1, index, element, selected[1]) }}>&rarr;</Button></Card.Footer>
                  </Card><br /><br /></>
                )}
              </Col>
              <Col>
                <h4>List {selected[1]}</h4>
                {listMap.get(parseInt(selected[1])).map((element, index) =>
                  <><Card>
                    <Card.Title>{element.split("-")[0]}</Card.Title>
                    <Card.Body>{element.split("-")[1]}</Card.Body>
                    <Card.Footer><Button variant="outline-secondary" onClick={() => { removeAndAdd(selected[1], index, element) }}>&larr;</Button></Card.Footer>
                  </Card><br /><br /></>
                )}
              </Col>
            </Row>
          </Container>
          <Button variant="info" onClick={cancelEdit} style={{ marginRight: "40px" }}>Back &larr;</Button>
          {/* <Button variant="primary">Update</Button> */}
        </>}

    </div>
  );
}

export default App;
