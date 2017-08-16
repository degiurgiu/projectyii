<?php

/**
 * This is the model class for table "tbl_user".
 *
 * The followings are the available columns in table 'tbl_user':
 * @property integer $id
 * @property string $email
 * @property string $url
 * @property integer $role
 * @property string $firstname
 * @property string $lastname
 * @property string $password
 * @property integer $status
 * @property string $last_login_time
 * @property string $create_dt
 */
class User extends CActiveRecord
{
         const ROLE_AUTHOR=3;
	const ROLE_MODERATOR=2;
	const ROLE_ADMIN=1;
        //public $role;
	public $passwordSave;
	public $repeatPassword;
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'tbl_user';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
                        array('passwordSave, repeatPassword', 'required', 'on'=>'insert'),
			array('passwordSave, repeatPassword', 'length', 'min'=>6, 'max'=>40),
			array('repeatPassword', 'compare', 'compareAttribute'=>'passwordSave'),
			
                    
			array('email', 'required'),
			array('role, status', 'numerical', 'integerOnly'=>true),
			array('email, url, firstname, lastname, password', 'length', 'max'=>256),
			array('last_login_time, create_dt', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, email, url, role, firstname, lastname, password, status, last_login_time, create_dt', 'safe', 'on'=>'search'),
		);
	}
         public function beforeSave() {
		// see http://www.yiiframework.com/wiki/277/model-password-confirmation-field/ for more details
		parent::beforeSave();
		//add the password hash if it's a new record
                
		if ($this->isNewRecord) {
		    $this->password = md5($this->password);	
//                    CVarDumper::dump(md5($this->password));
//                    exit();
		    $this->create_dt= new CDbExpression("NOW()");
		}       
		else if (!empty($this->passwordSave)&&!empty($this->repeatPassword)&&($this->passwordSave===$this->repeatPassword)) 
		//if it's not a new password, save the password only if it not empty and the two passwords match
		{
                     
		    $this->password = md5($this->passwordSave);
		}
		return true;
	}
        public function fullName() {
            $fullName=(!empty($this->firstname))? $this->firstname : '';
            $fullName.=(!empty($this->lastname))?( (!empty($fullName))? " ".$this->lastname : $this->lastname ) : '';
            return $fullName;
        }
         public function role() {
             $role = $this->role;
             return $role;
         }

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
                    'albums' => array(self::HAS_MANY, 'Album', 'owner_id'),
                    'comments' => array(self::HAS_MANY, 'Comment', 'author_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'email' => 'Email',
			'url' => 'Url',
			'role' => 'Role',
			'firstname' => 'Firstname',
			'lastname' => 'Lastname',
			'password' => 'Password',
        		'status' => 'Status',
//			'last_login_time' => 'Last Login Time',
//			'create_dt' => 'Create Dt',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('email',$this->email,true);
		$criteria->compare('url',$this->url,true);
		$criteria->compare('role',$this->role);
		$criteria->compare('firstname',$this->firstname,true);
		$criteria->compare('lastname',$this->lastname,true);
		$criteria->compare('password',$this->password,true);
		$criteria->compare('status',$this->status);
//		$criteria->compare('last_login_time',$this->last_login_time,true);
//		$criteria->compare('create_dt',$this->create_dt,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return TblUser the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
