import React, { Component } from 'react';
import Pagination from 'react-paginate';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SearchIcon from '@material-ui/icons/Search';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import classes from 'C:/Users/Shatha Barqawi/Documents/Github Projects/better-marje3/src/components/StudentComponents/UI/Filters/Filters.module.css';
import NoResults from '../../../components/StudentComponents/UI/noResults/noResults';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import FiltersList from '../../../components/StudentComponents/UI/Filters/FiltersList/FiltersList';
import Cookies from 'js-cookie';
import Axios from 'axios';

class NotesFilters extends Component{
   state={
      //For the pagination
      offset: 0,
      perPage: 9,
      currentPage: 0,
      pageCount:0,
      checkedCourses:[],
      checkedTypes:[],
      cards:[],
      filteredCards:[],
      courses:[],
      resourceFile:"",

      showNoResultsSVG:false
}


filteredResources = (newIds) =>{
    let tempArr = [];
    tempArr.push(this.props.type);
    let config = { 
        headers: { Authorization: `${JSON.parse(Cookies.get('marje3'))}` } 
    };
    Axios.post("http://localhost:1234/Resource/Search",{
        "courses": newIds,
        "isApproved":false,
        "offset": 0,
        "count": 99999,
        "types":tempArr
      },config)
      .then((response) => {
        let tempArr = [];
        response.data.map((resource)=>{
            let semester= "";
            switch(resource.creationSemester)
            {
                case 0:
                    semester = "first";
                    break;
                case 1:
                    semester = "second";
                    break;
                case 2:
                    semester = "summer";

            }
            tempArr.push({
                id:resource.id,
                name:resource.name,
                description:{
                    course:resource.course.name,
                    author:resource.volunteer.name,
                    creationDate:`Created In ${resource.creationYear}, in ${semester} semester`
                }
            })
        });
        if(tempArr.length == 0)
            this.setState({filteredCards:[...tempArr],showNoResultsSVG:true},()=>this.recievedData());
        else
            this.setState({filteredCards:[...tempArr],showNoResultsSVG:false},()=>this.recievedData());
        
    });
}

   filtersMounting = async() =>{
        try{
            const result = await  Axios.post("http://localhost:1234/Course/GetAll",{
                "offset": 0,
                "count": 99999
              });
            const finalResult = await Axios.post("http://localhost:1234/Course/Get",result.data);
            let tempArr = [];
            finalResult.data.map((course)=>{
                tempArr.push({
                    id:course.id,
                    name:course.name,
                    checked:false,
                    
                })
            });
           this.setState({courses:[...tempArr]})
        }
        catch(error){
            console.log("Error = ",error);
        }
    }
   
    getResources = async() =>{
        let types = [];
        types.push(this.props.type);

        let config = { 
            headers: { Authorization: `${JSON.parse(Cookies.get('user')).token}` } 
        };
        try{
           
            const finalResult = await Axios.post("http://localhost:1234/Resource/Search",{
                isApproved:false,
                offset:0,
                count:99999,
                types:types
            },config);

            let tempArr = [];
            console.log("Final Results: ",finalResult);
            // let resources = finalResult.data.filter(resource => resource.isApproved === false);
            let resources = finalResult.data;
            resources.map((resource)=>{
                   if(resource.type === this.props.type)
                    {
                    let semester= "";
                    switch(resource.creationSemester)
                    {
                        case 0:
                            semester = "first";
                            break;
                        case 1:
                            semester = "second";
                            break;
                        case 2:
                            semester = "summer";

                    }
                    tempArr.push({
                        id:resource.id,
                        name:resource.name,
                        description:{
                            course:resource.course.name,
                            author:resource.volunteer.name,
                            creationDate:`Created In ${resource.creationYear}, in ${semester} semester`
                        }
                })
            }});
            if(tempArr.length == 0)
                this.setState({showNoResultsSVG:true});
            else
                this.setState({cards:[...tempArr], filteredCards:[...tempArr]},()=>this.recievedData());
        }
        catch(error){
            console.log("Error = ",error);
        } 
    
    }

  recievedData =()=>{
    const slice = this.state.filteredCards.slice(this.state.offset, this.state.offset + this.state.perPage);
    
    this.setState({
        pageCount: Math.ceil(this.state.filteredCards.length / this.state.perPage)
    },this.props.handleData(slice));
}

  handlePageClick = (e) => {
   const selectedPage = e.selected;
   const offset = selectedPage * this.state.perPage;
   this.setState({
       currentPage: selectedPage,
       offset: offset
   },
   ()=>this.recievedData());
};

   componentDidMount(){
        this.recievedData();
        this.filtersMounting();
        this.getResources();
   }

   filterCourse = (courseId) =>{
    if(this.state.checkedCourses.indexOf(courseId)==-1)
       {
            let tempArr = [...this.state.checkedCourses];
            tempArr.push(courseId);
            this.setState({checkedCourses:[...tempArr]},()=>this.filteredResources(tempArr));
       }
    else{
        let coursesExceptOne = [];
        for(let i in this.state.checkedCourses)
        {
            if(this.state.checkedCourses[i] === courseId)
              continue;
            coursesExceptOne.push(this.state.checkedCourses[i]);
        }
        this.setState({checkedCourses: [...coursesExceptOne]},()=>this.filteredResources(coursesExceptOne,this.state.newTypes));
    }
   }

   filterType = (typeNum) =>{
    if(this.state.checkedTypes.indexOf(typeNum)==-1)
    {
         let tempArr = [...this.state.checkedTypes];
         tempArr.push(typeNum);
         this.setState({checkedTypes:[...tempArr]},()=>this.filteredResources(this.state.checkedCourses,tempArr));
    }
 else{
     let typesExceptOne = [];
     for(let i in this.state.checkedTypes)
     {
         if(this.state.checkedTypes[i] === typeNum)
           continue;
         typesExceptOne.push(this.state.checkedTypes[i]);
     }
     this.setState({checkedTypes: [...typesExceptOne]},()=>this.filteredResources(this.state.checkedCourses,typesExceptOne));
 }
   }

   
   
   render()
   {
        const accCards = [
            {
                title:"Courses",
                data:[...this.state.courses],
                checkedValues:[...this.state.checkedCourses],
                filterValue:(courseId)=>this.filterCourse(courseId)
            }];

            return(
            <Container fluid={+true}>
                <Row>
                <Col sm={3} className={classes.filterCol}>
                    <p className={classes.filtersTitle}> Refine By </p>
                   
                    <Accordion 
                    className={classes.accordion}>
                         {accCards.map((card,index)=>{
                            return(
                                <Card 
                                className={classes.card}
                                key={index+2}>
                                <Accordion.Toggle 
                                className={classes.cardHeader} 
                                as={Card.Header} 
                                eventKey={index.toString()}>
                                <p> {card.title} </p>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={index.toString()}>
                                <Card.Body>
                                    <FiltersList 
                                    checkedValues={card.checkedValues}
                                    filters={card.data}
                                    filterValue={(courseId)=>card.filterValue(courseId)}/>
                                </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            );})
                            } 
                        </Accordion>
                </Col>
                <Col>
                    <NoResults isShown={this.state.showNoResultsSVG}/>
                    {this.props.children} 

                    <Pagination
                    containerClassName={classes.pagination}
                    activeClassName={classes.active}
                    previousLabel={<ArrowBackIcon/>}
                    nextLabel={<ArrowForwardIcon/>}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={10}
                    onPageChange={(event)=>this.handlePageClick(event)}/>
                </Col>
                </Row>
            </Container>
      );
   }
}

export default NotesFilters;