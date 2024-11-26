<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;
    protected $fillable =[
        'name',
        'description',
        'owner_id',
        'last_message_id'
    ];
    public function users(){
        return $this->belongsToMany(User::class,'group_users');
    }
    public function message(){
        return $this->hasMany(Messenger::class);
    }
    public function owner(){
        return $this->belongsTo(User::class);// Mỗi Group thuộc về 1 User
    }


    public static function getGroupsExceptUser(User $user){
        $userId = $user->id;
        $query = Group::select(['groups.*', 'messengers.message as last_message', 'messengers.created_at as last_message_date'])
            ->Join('group_users','group_users.group_id','=','groups.id')
            ->leftJoin('messengers', 'messengers.id', '=', 'groups.last_message_id')
            ->where('group_users.user_id', $userId)
            ->orderBy('messengers.created_at','desc')
            ->orderBy('groups.name');
        return $query->get(); // Trả về kết quả truy vấn
    }

    public function toConversationArray(){
        return [
            'id'=> $this->id,
            'name'=>$this->name,
            'description'=>$this->description,
            'is_group' => true,
            'is_user' => false,
            'owner_id' =>$this->owner_id,
            'users' =>$this->users,
            'user_ids'=>$this->users->pluck('id'),
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at,
            'last_message'=> $this->last_message,
            'last_message_date'=> $this->last_message_date,        
        ];
    }
}
