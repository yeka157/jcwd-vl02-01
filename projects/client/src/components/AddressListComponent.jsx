import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  Input,
  Select,
  Td,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline, MdCancel, MdSave } from "react-icons/md";
import Axios from "axios";
import { API_URL } from "../helper";
import ButtonComponent from "./ButtonComponent";
import Cookies from 'js-cookie';
import { useDispatch } from "react-redux";
import { userAddress } from "../slices/addressSlice";

export default function AddressListComponent(props) {
  const [selectedData, setSelectedData] = React.useState(0);
  const [selectedEdit, setSelectedEdit] = React.useState(0);
  const [toggleDelete, setToggleDelete] = React.useState(false);
  const [editProvince, setEditProvince] = React.useState(props.province);
  const [editCity, setEditCity] = React.useState(props.city);
  const [editDistrict, setEditDistrict] = React.useState(props.district);
  const [editAddress, setEditAddress] = React.useState(props.address);
  const [dataProvince, setDataProvince] = React.useState([]);
  const [dataCity, setDataCity] = React.useState([]);
  const [provinceId, setProvinceId] = React.useState("");
  const [cityId, setCityId] = React.useState(props.city_id);
  const cancelRef = React.useRef();
  const toast = useToast();
  const dispatch = useDispatch();

  const btnDelete = async(id) => {
    try {
      let token = Cookies.get('sehatToken');
      let delete_address = await Axios.delete(API_URL + `/user/delete_address/${id}`, {
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      dispatch(userAddress(delete_address.data));
      toast({
        title : 'Address deleted',
        status : 'success',
        duration : 3000,
        isClosable : true,
        position : 'top'
      });
      setSelectedData(0);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataProvince = () => {
    Axios.get(API_URL + "/rajaOngkir/get_province")
      .then((res) => {
        setDataProvince(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDataCity = async (province_id) => {
    try {
      let res = await Axios.post(API_URL + "/rajaOngkir/get_city", {
        province: province_id.split("-")[0],
      });
      setDataCity(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const btnSave = async(id) => {
    try {
      if (!editProvince || !editCity || !editDistrict || !editAddress) {
        toast({
          title : 'Please fill out the form',
          status : 'error',
          duration : 3000,
          isClosable : true,
          position : 'top'
        })
      } else {
        let token = Cookies.get('sehatToken');
        let update = await Axios.patch(API_URL + `/user/edit_address/${id}`, {
          province : editProvince,
          city : editCity,
          city_id : cityId,
          address_detail : editAddress,
          district : editDistrict
        }, {
          headers : {
            'Authorization' : `Bearer ${token}`
          }
        });
        dispatch(userAddress(update.data));
        toast({
          title : 'Address successfully updated',
          status : 'success',
          duration : 3000,
          isClosable : true,
          position : 'top'
        })
        setSelectedEdit(0);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const btnSetMainAddress = async(id) => {
    try {
      console.log(id);
      let token = Cookies.get('sehatToken');
      let change = await Axios.patch(API_URL + `/user/edit_main_address/${id}`,{}, {
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      dispatch(userAddress(change.data));
      toast({
        title : 'Main address changed',
        status : 'success',
        duration : 3000,
        isClosable : true,
        position : 'top'
      });
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    // getDataProvince();
    // console.log(props.city_id);
  }, []);

  return (
    <Tr>
      {/* Edit button */}
      {selectedEdit ? (
        <>
          <Td className='px-1'>{props.no}</Td>
          <Td className='px-1'>
            <FormControl>
              <Select
                placeholder="Select province"
                onChange={(e) => {
                  setProvinceId(e.target.value.split("-")[0]);
                  getDataCity(e.target.value);
                  setEditProvince(e.target.value.split("-")[1]);
                }}
              >
                {dataProvince.map((val) => {
                  return (
                    <option key={val.province_id} value={`${val.province_id}-${val.province}`}>{val.province}</option>
                  )
                })}
              </Select>
            </FormControl>
          </Td>
          <Td className='px-1'>
            <FormControl>
              <Select
                onChange={(e) => {
                  setEditCity(e.target.value.split("-")[1]);
                  setCityId(e.target.value.split("-")[0]);
                }}
                placeholder='Select city'
              >
                {dataCity.map((val) => {
                  return (
                    <option key={val.city_id} value={`${val.city_id}-${val.type} ${val.city_name}`}>{val.type} {val.city_name}</option>
                  )
                })}
              </Select>
            </FormControl>
          </Td>
          <Td className='px-1'>
            <FormControl>
              <Input
                defaultValue={props.district}
                onChange={(e) => setEditDistrict(e.target.value)}
              />
            </FormControl>
          </Td>
          <Td className='px-1'>
            <FormControl>
              <Input
                defaultValue={props.address}
                onChange={(e) => setEditAddress(e.target.value)}
              />
            </FormControl>
          </Td>
          <Td className='px-1'>
            <div className="flex space-x-3">
              <MdCancel onClick={() => setSelectedEdit(0)} className='h-9 hoverIcons font-medium text-red-600'/>
              <MdSave className="h-9 hoverIcons font-medium text-blue-500" onClick={() => btnSave(selectedEdit)}/>
            </div>
          </Td>
        </>
      ) : (
        <>
          <Td className='px-1'>{props.no}</Td>
          <Td className='px-1'>{props.province}</Td>
          <Td className='px-1'>{props.city}</Td>
          <Td className='px-1'>{props.district}</Td>
          <Td className='px-1'>{props.address}</Td>
          <Td className='px-1'>
            <div className="flex space-x-3">
              <FiEdit
                className="h-9 hoverIcons text-yellow-500 font-medium"
                onClick={() => {
                  setSelectedEdit(props.id);
                  getDataProvince();
                }}
              />
              <MdDeleteOutline
                className="h-9 hoverIcons text-red-600"
                onClick={() => {
                  setSelectedData(props.id);
                  setToggleDelete(!toggleDelete);
                }}
              />
            </div>
          </Td>
        </>
      )}
      {/* Delete button */}
      {selectedData ? (
        <AlertDialog
          isOpen={toggleDelete}
          onClose={() => {
            setToggleDelete(!toggleDelete);
            setSelectedData(0);
          }}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Delete Address</AlertDialogHeader>
              <AlertDialogBody>
                Are you sure? You can't undo this action.
              </AlertDialogBody>
              <AlertDialogFooter className="space-x-3">
                <Button
                  ref={cancelRef}
                  onClick={() => {
                    setToggleDelete(!toggleDelete);
                    setSelectedData(0);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => btnDelete(selectedData)}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      ) : (
        <></>
      )}
      <Td className='px-1'>
        {/* Main address button */}
        {props.main ? 
        <ButtonComponent text='Main Address' class='border border-borderHijau rounded-full cursor-default text-black disabled' brightness='100' py='2' px='1'/>
        : 
        <ButtonComponent text='Set Main Address' class='border border-borderHijau rounded-full hover:bg-hijauBtn hover:text-white text-black' brightness='90' py='2' px='1' onclick={() => btnSetMainAddress(props.id)}/>
        }
      </Td>
    </Tr>
  );
}
