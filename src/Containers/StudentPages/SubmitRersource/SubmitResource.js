import React,{Component} from 'react';
import Header from '../../../components/header/header';
import Footer from '../../../components/footer/footer';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropdownList from '../../../components/StudentComponents/UI/DropdownList/DropdownList';
import Dropdown from 'react-bootstrap/Dropdown';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import classes from '../Signup/Signup.module.css';
import classes2 from './SubmitResource.module.css';
import Cookies from 'js-cookie';

class SubmitResource extends Component {
    state = {
        avatar:null,
        courses:[],
        chosenCourse:{
            name:"",
            id:0
        },
        chosenSemester:{
            name:"",
            num:0
        },
        chosenYear:0,
        resource_name:"",
        resource_extension:"",
        resource_file:"",
        file_name:"",
        open_snackbar:false,
        radio_types:{
            type_0:false,//Notes
            type_1:false,//Slides
            type_2:false,//Book
            type_3:false,//Exam
            type_4:false//Quiz
        },
        chosenType:null,
        hideSuccessAlert:true,
        hideWarningAlert:true
    }

    componentDidMount = ()=> {
        this.getCourses()
    }

    getCourses = async() =>{
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
                    name:course.name,})
                });
            this.setState({courses:[...tempArr]});
        }
        catch(error){
            console.log("Error = ",error);
        } 
    }

    handleChange = (key,event)=>{
        switch(key)
        {
            case "name":
                this.setState({ resource_name:event.target.value});
                break;
    
            case "year":
                this.setState({ resource_year:parseInt(event.target.value,10)});
                break;
    
            case "semester":
                this.setState({ resource_semester:event.target.value});
                break;
    
            case "file":
                let splitFileName = event.target.value.split(".");
                console.log("file extension --> ",splitFileName[1])
              let reader = new FileReader();
                reader.onload = (e)=>{
                  this.setState({resource_file: e.target.result,resource_extension:splitFileName[1]});
                };
                reader.readAsDataURL(event.target.files[0]); 
                break;

            default://radio
                {
                    let value = true;
                    switch(key){

                        case "type_0":
                            if(this.state.radio_types.type_0)
                                value = false;
                            this.setState( prevState =>{
                                return{
                                    radio_types:{
                                        ...prevState.radio_types,
                                        type_0:value
                                      }}
                                },this.setState({chosenType:0})); 
                            break;
                        case "type_1":
                            if(this.state.radio_types.type_1)
                                value = false;
                            this.setState( prevState =>{
                                return{
                                    radio_types:{
                                        ...prevState.radio_types,
                                        type_1:value
                                      }}
                                },this.setState({chosenType:1})); 
                            break;
                        case "type_2":
                            if(this.state.radio_types.type_2)
                                value = false;
                            this.setState( prevState =>{
                                return{
                                    radio_types:{
                                        ...prevState.radio_types,
                                        type_2:value
                                      }}
                                },this.setState({chosenType:2})); 
                            break;
                        
                        case "type_3":
                            if(this.state.radio_types.type_3)
                                value = false;
                            this.setState( prevState =>{
                                return{
                                    radio_types:{
                                        ...prevState.radio_types,
                                        type_3:value
                                      }}
                                },this.setState({chosenType:3})); 
                            break;

                        case "type_4":
                            if(this.state.radio_types.type_4)
                                value = false;
                            this.setState( prevState =>{
                                return{
                                    radio_types:{
                                        ...prevState.radio_types,
                                        type_4:value
                                      }}
                                },this.setState({chosenType:4})); 
                            break;
                    }
                }
        }
    }

    handleCourseDropdown = (course_id,course_name)=>{
        this.setState({
            chosenCourse: { 
                name:course_name,
                id:course_id
        }
        });
    }

    handleSemesterDropdown = (sem_num,sem_name)=>{
        this.setState({
            chosenSemester: { 
                name:sem_name,
                num:sem_num
        }
        });
    }

    handleYearDropdown = (year)=>{
        this.setState({
            chosenYear:year
        });
    }

    clearAll = () =>{
        this.setState({
            chosenCourse:{
                name:"",
                id:0
            },
            chosenSemester:{
                name:"",
                num:0
            },
            chosenYear:0,
            resource_name:"",
            resource_file:"",
            open_snackbar:false,
            radio_types:{
                type_0:false,//Notes
                type_1:false,//Slides
                type_2:false,//Book
                type_3:false, //Exam
                type_4:false//Quiz
            },
            chosenType:null
        })
    }

    handleSubmit = () =>{
        
        let data = {
            courseId:this.state.chosenCourse.id,
            creationYear:this.state.chosenYear,
            creationSemester:this.state.chosenSemester.num,
            name:this.state.resource_name,
            resource:{
                contentBase64:this.state.resource_file.split(',')[1],
                fileExtension:this.state.resource_extension
            },
            type:this.state.chosenType
        }
        console.log("data:",data);
        const config = { 
            headers: { Authorization: `${JSON.parse(Cookies.get('user')).token}` } 
        };
        Axios.post("http://localhost:1234/Resource/Create",data,config)
        .then(response =>{
          console.log(response);
          this.setState({open_snackbar:true}, ()=>this.clearAll());  
       })
      .catch((error)=>{
        console.log(error);
       });
    }

    handleCloseSnackbar = ()=>{
        this.setState({open_snackbar:false});
    }

    render(){
        let semesters = [ {name:"first",num:1}, {name:"second",num:2}, {name:"summer",num:3} ];

        let years = [];
        for(let i=2000; i<2022;i++)
            years.push(i);

        return(
            <>
            <Container fluid={+true} className={classes2.Container}>
                <Row>
                    <Header 
                    pageType={"Home"} 
                    userName={this.props.username===null?null:this.props.username} 
                    avatar={this.state.avatar}/> 
                </Row>
                    <Row className={classes.ModalContainer}>
                        <Col className={classes.create_res_col}>
                        <Form.Group>
                            <Form.Label> Title </Form.Label>
                            <Form.Control 
                            type="text"
                            value={this.state.resource_name}
                            className={classes2.textBox} 
                            onChange={(event)=>this.handleChange("name",event)}/>
                        </Form.Group>

                        <br/>
                        <Form.Label> Year of Creation </Form.Label>
                        <DropdownList 
                        text={this.state.chosenYear !== 0?this.state.chosenYear:"Year of Creation"}
                        dark={false}
                        className={classes2.dropdownList}>
                            {years.map((year,index)=>{
                            return(
                                <Dropdown.Item
                                key={index}
                                onClick={()=>this.handleYearDropdown(year)}>{year}</Dropdown.Item>
                            );
                            })}
                        </DropdownList>
                        
                        <br/>
                        <Form.Label> Semester of Creation </Form.Label>
                        <DropdownList 
                        text={this.state.chosenSemester.name !== ""?this.state.chosenSemester.name:"Semester of Creation"}
                        dark={false}
                        className={classes2.dropdownList}>
                            {semesters.map((semester,index)=>{
                            return(
                                <Dropdown.Item
                                key={index}
                                onClick={()=>this.handleSemesterDropdown(semester.num,semester.name)}>{semester.name}</Dropdown.Item>
                            );
                            })}
                        </DropdownList>
                        </Col>
                        <Col className={classes.create_res_col_2}>
                        <Form.Label> Relevant Course </Form.Label>
                        <DropdownList 
                        text={this.state.chosenCourse.name !== ""?this.state.chosenCourse.name:"Choose the resource course"}
                        dark={false}
                        className={classes2.dropdownList}>
                            {this.state.courses.map((course,index)=>{
                            return(
                                <Dropdown.Item
                                key={index}
                                onClick={()=>this.handleCourseDropdown(course.id,course.name)}>{course.name}</Dropdown.Item>
                            );
                            })}
                        </DropdownList>
                        <br/>
                        <fieldset id="group2" className="mb-3">
                            <Form.Label> Type of Resource </Form.Label>
                            <br/>
                            <Form.Check
                            type="radio"
                            label="Notes"
                            value={this.state.radio_types.type_0}
                            name="formHorizontalRadios"
                            id="type_0"
                            // key='group2'
                            inline
                            onChange={(event)=>this.handleChange("type_0",event)}/>
                            <Form.Check
                            type="radio"
                            label="Exam"
                            value={this.state.radio_types.type_1}
                            name="formHorizontalRadios"
                            id="type_1"
                            // key='group2'
                            inline
                            onChange={(event)=>this.handleChange("type_1",event)}/>
                            <Form.Check
                            type="radio"
                            label="Books"
                            value={this.state.radio_types.type_2}
                            name="formHorizontalRadios"
                            id="type_2"
                            // key='group2'
                            inline
                            onChange={(event)=>this.handleChange("type_2",event)}/>
                            <Form.Check
                            type="radio"
                            label="Quiz"
                            value={this.state.radio_types.type_3}
                            name="formHorizontalRadios"
                            id="type_3"
                            // key='group2'
                            inline
                            onChange={(event)=>this.handleChange("type_3",event)}/>
                            <Form.Check
                            type="radio"
                            label="Slides"
                            value={this.state.radio_types.type_4}
                            name="formHorizontalRadios"
                            id="type_4"
                            // key='group2'
                            inline
                            onChange={(event)=>this.handleChange("type_4",event)}/>
                        </fieldset>
                        <Form.Group>
                            <Form.File  
                            className={classes.ProfileAvatar} 
                            label="Upload File"
                            onChange={(event)=>this.handleChange("file",event)}/>
                        </Form.Group>
                        <Button 
                        className={classes.SubmitButton}  
                        onClick={this.handleSubmit} 
                        size="lg">
                        Submit
                        </Button>
                        </Col>
                    </Row>

                <Row>
                    <Footer/>
                </Row>
            </Container>
             {/*_____SnackBar when saving a question_____ */}
             <Snackbar
             anchorOrigin={{
             vertical: 'bottom',
             horizontal: 'left',
             }}
             open={this.state.open_snackbar}
             autoHideDuration={10000}
             onClose={this.handleCloseSnackbar}
             message={`We will check ${this.state.resource_name} as soon as we can`}
             action={
             <React.Fragment>
                 <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                     <CloseIcon fontSize="small" />
                 </IconButton>
             </React.Fragment>}/>
             {/*_____________________________________________*/}
             </>
        );
    }
}
export default SubmitResource;