<?php
 
// this file must be stored in:
// protected/components/WebUser.php
class WebUser extends CWebUser {
 
   // Store model to not repeat query.
    private $_model;
    // Return first name.
    // access it by Yii::app()->user->first_name
    function getFirstName(){
	$user = $this->loadUser(Yii::app()->user->id);
	return $user->firstname;
    }
    function getFullName(){
	$user = $this->loadUser(Yii::app()->user->id);
	return $user->fullName();
    }
    function getRole(){
	$user = $this->loadUser(Yii::app()->user->id);
	return $user->role();
    }
    
    // This is a function that checks the field 'role'
    // in the User model to be equal to ROLE_ADMIN, that means it's admin
    // access it by Yii::app()->user->isAdmin()
    function isAdmin(){
	$user = $this->loadUser(Yii::app()->user->id);
	if ($user!==null)
	    return intval($user->role) == User::ROLE_ADMIN;
	else return false;
    }
    function isModerator(){
	$user = $this->loadUser(Yii::app()->user->id);
	if ($user!==null)
	    return intval($user->role) == User::ROLE_MODERATOR;
	else return false;
    }
       function isAuthor(){
	$user = $this->loadUser(Yii::app()->user->id);
	if ($user!==null)
	    return intval($user->role) == User::ROLE_AUTHOR;
	else return false;
    }

    // Load user model.
    protected function loadUser($id=null)
    {
	if($this->_model===null)
	{
	    if($id!==null)
//                $print= $this->_model=User::model()->findByPk($id);
//            echo "hello".$print['password'];
//                CVarDumper::dump($this->_model=User::model()->findByPk($id));
//            exit();
		$this->_model=User::model()->findByPk($id);
	}

	return $this->_model;
    }
}
?>